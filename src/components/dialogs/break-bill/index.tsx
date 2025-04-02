'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { TableDataType } from '@/types/adminTypes'
import { CustomerInvoiceType, CustomerListType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import { Autocomplete, Avatar, Chip, Divider, Drawer, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type BreakBillPropType = {
  open: boolean
  setOpen: (open: boolean) => void
  tableData: TableDataType
  customersList: CustomerListType[]
  getAllTablesData: () => void
  getCustomerData: () => void
  setIsBreakGameActive: (value: boolean) => void
}

// const paymentMethods = ['CASH', 'UPI', 'CARD']

const BreakBill = ({
  open,
  setOpen,
  tableData,
  customersList,
  getAllTablesData,
  getCustomerData,
  setIsBreakGameActive
}: BreakBillPropType) => {
  // States
  const [data, setData] = useState({} as CustomerInvoiceType)
  const [invoiceTo, setInvoiceTo] = useState<CustomerListType | null>(null)

  const [errors, setErrors] = useState({} as { invoiceTo: string })

  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(false)
  const [isStopButtonDisabled, setIsStopButtonDisabled] = useState(false)

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const totalSeconds =
    data?.selectedTable?.gameData?.startTime && data?.selectedTable?.gameData?.endTime
      ? DateTime.fromISO(data.selectedTable.gameData.endTime).diff(
          DateTime.fromISO(data.selectedTable.gameData.startTime),
          ['seconds']
        ).seconds
      : 0

  // const totalMinutes = Math.ceil(totalSeconds / 60)

  // Now break down total minutes into hours and minutes
  // const hours = Math.floor(totalMinutes / 60) // full hours
  // const minutes = totalMinutes % 60

  const getBillData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    if (open && tableData._id) {
      try {
        const response = await axios.get(`${apiBaseUrl}/games/getBilling/${tableData._id}`, {
          headers: { 'auth-token': token }
        })
        if (response && response.data) {
          setData(response.data)
        }
      } catch (error: any) {
        if (error?.response?.status === 409) {
          const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
          return router.replace(redirectUrl)
        }
        toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      }
    }
  }

  useEffect(() => {
    getBillData()
    getCustomerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData._id, open])

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async () => {
    setIsContinueButtonDisabled(true)
    setTimeout(() => setIsContinueButtonDisabled(false), 3000)

    if (!invoiceTo) {
      setErrors({ invoiceTo: 'This field is required' })
      return
    }

    // const players = invoiceTo.map(customer => {
    //   if (typeof customer === 'string') {
    //     return { fullName: customer }
    //   }
    //   return customer
    // })

    // const requestData = {
    //   timeDelta: data.timeDelta,
    //   totalBillAmt: data.totalBillAmt,
    //   players
    // }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/break/${tableData._id}`,
        { customerId: invoiceTo?.customerId },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        setIsBreakGameActive(false)
        handleClose()
        toast.success('Good Job!', { icon: <>👏</> })
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const stopGame = async () => {
    setIsStopButtonDisabled(true)
    setTimeout(() => setIsStopButtonDisabled(false), 3000)

    await handleSubmit()
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/games/stopGame/${tableData._id}`,
        {},
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        setIsBreakGameActive(false)
        handleClose()
        toast.success(`${tableData.tableName} stopped`)
      }
    } catch (error: any) {
      if (error?.response?.status === 422) {
        getAllTablesData()
        handleClose()
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const handleCustomerChange = (value: CustomerListType) => {
    setInvoiceTo(value)
  }

  const getOptions = () => {
    const list = customersList.map(customer => {
      if (data.selectedTable?.gameData?.players?.find(player => player.customerId === customer.customerId)) {
        return {
          ...customer,
          group: 'Playing Customer'
        }
      }

      return {
        ...customer,
        group: 'Search'
      }
    })

    return _.sortBy(list, 'group')
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 340, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{tableData.tableName}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <div className='flex flex-col gap-3'>
          {data?.selectedTable?.gameData?.gameType ? (
            <TextField
              disabled
              id='gameType'
              label='Billing'
              size='small'
              defaultValue={data?.selectedTable?.gameData?.gameType}
            ></TextField>
          ) : (
            <></>
          )}

          {data.selectedTable?.gameData?.startTime ? (
            <div className='w-full grid grid-cols-2 gap-2 border p-3 rounded-lg'>
              {data.selectedTable.gameData?.startTime ? (
                <p>
                  Start Time
                  <br />
                  <span className='font-bold'>
                    {DateTime.fromISO(data.selectedTable.gameData.startTime).toFormat('hh:mm:ss a')}
                  </span>
                </p>
              ) : (
                <></>
              )}

              {data.selectedTable.gameData?.endTime ? (
                <p>
                  End Time
                  <br />
                  <span className='font-bold'>
                    {DateTime.fromISO(data.selectedTable.gameData.endTime).toFormat('hh:mm:ss a')}
                  </span>
                </p>
              ) : (
                <></>
              )}

              {totalSeconds ? (
                <>
                  <Divider className='col-span-2' />
                  <p>Total Time</p>
                  <p>
                    {Math.floor(data.timeDelta / 60) || '00'}hrs {data.timeDelta % 60 || '00'}mins
                  </p>
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {data.selectedTable?.gameData?.endTime ? (
            <>
              <div className='w-full grid grid-cols-2 gap-2 border p-3 rounded-lg'>
                <p>Table Amount</p>
                <p>{`₹${data.totalBillAmt || 0}`}</p>
              </div>
              {/* <div className='w-full bg-[#E73434] grid grid-cols-2 gap-2 border p-4 mt-2 rounded-lg'>
                <p>Net Pay</p>
                <p>{`₹${data.totalBillAmt}`}</p>
              </div> */}
            </>
          ) : (
            <></>
          )}

          {data.selectedTable?.gameData?.players ? (
            <Autocomplete
              size='small'
              disableClearable
              options={getOptions()}
              getOptionLabel={option => (option as CustomerListType)?.fullName ?? option}
              groupBy={option => (option as CustomerListType & { group: string }).group}
              getOptionKey={option => (option as CustomerListType).customerId}
              isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
              // multiple
              // freeSolo
              value={invoiceTo ? invoiceTo : undefined}
              onChange={(_, value) => handleCustomerChange(value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index })
                  return (
                    <Chip
                      size='small'
                      variant='outlined'
                      avatar={
                        (option as CustomerListType).fullName ? (
                          <Avatar>{getInitials((option as CustomerListType).fullName)}</Avatar>
                        ) : (
                          <></>
                        )
                      }
                      label={(option as CustomerListType).fullName ?? option}
                      {...tagProps}
                      key={key}
                    />
                  )
                })
              }
              renderInput={params => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    enterKeyHint: 'enter'
                  }}
                  variant='outlined'
                  label='Assign Customer'
                  {...(errors.invoiceTo && !invoiceTo ? { error: true, helperText: errors.invoiceTo } : {})}
                />
              )}
            />
          ) : (
            <></>
          )}

          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleSubmit} disabled={isContinueButtonDisabled || !invoiceTo}>
              Continue
            </Button>

            <Button variant='outlined' color='error' onClick={stopGame} disabled={isStopButtonDisabled || !invoiceTo}>
              Stop Game
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default BreakBill
