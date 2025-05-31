'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { TableDataType } from '@/types/adminTypes'
import { CustomerListType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import { Autocomplete, Avatar, Chip, Divider, Drawer, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'

type BreakBillPropType = {
  open: boolean
  setOpen: (open: boolean) => void
  setShowBill: (open: boolean) => void
  tableData: TableDataType
  breakData: BreakBillType
  customersList: CustomerListType[]
  setTableData: (data: TableDataType) => void
  getAllTablesData: () => void
  getCustomerData: () => void
}

export type BreakBillType = {
  gameData: {
    players: CustomerListType[]
    gameType: string
    startTime: string
    endTime: string
  }
  time: number
  totalAmount: string
}

// const paymentMethods = ['CASH', 'UPI', 'CARD']

const BreakBill = ({
  open,
  setOpen,
  setShowBill,
  tableData,
  breakData,
  customersList,
  setTableData,
  getAllTablesData,
  getCustomerData
}: BreakBillPropType) => {
  // States
  // const [data, setData] = useState({} as CustomerInvoiceType)
  const [invoiceTo, setInvoiceTo] = useState<CustomerListType | null>(null)
  const [errors, setErrors] = useState({} as { invoiceTo: string })

  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(false)
  const [isStopButtonDisabled, setIsStopButtonDisabled] = useState(false)

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  // const totalMinutes = Math.ceil(totalSeconds / 60)

  // Now break down total minutes into hours and minutes
  // const hours = Math.floor(totalMinutes / 60) // full hours
  // const minutes = totalMinutes % 60

  // const getBillData = async () => {
  //   const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
  //   const token = localStorage.getItem('token')
  //   if (open && tableData._id) {
  //     try {
  //       const response = await axios.get(`${apiBaseUrl}/games/getBilling/${tableData._id}`, {
  //         headers: { 'auth-token': token }
  //       })
  //       if (response && response.data) {
  //         setData(response.data)
  //       }
  //     } catch (error: any) {
  //       if (error?.response?.status === 409) {
  //         const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
  //         return router.replace(redirectUrl)
  //       }
  //       toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
  //     }
  //   }
  // }

  useEffect(() => {
    // getBillData()
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
        `${apiBaseUrl}/games/resumeBreak/${tableData._id}`,
        { customerId: invoiceTo?.customerId },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
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
    getAllTablesData()
    setTableData(tableData)
    setShowBill(true)
  }

  const handleCustomerChange = (value: CustomerListType) => {
    setInvoiceTo(value)
  }

  const getOptions = () => {
    const list = customersList.map(customer => {
      if (breakData?.gameData?.players?.find(player => player.customerId === customer.customerId)) {
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
          {breakData?.gameData?.gameType ? (
            <TextField
              disabled
              id='gameType'
              label='Billing'
              size='small'
              defaultValue={breakData?.gameData?.gameType}
            ></TextField>
          ) : (
            <></>
          )}

          {breakData?.gameData?.startTime ? (
            <div className='w-full grid grid-cols-2 gap-2 border p-3 rounded-lg'>
              {breakData?.gameData?.startTime ? (
                <p>
                  Start Time
                  <br />
                  <span className='font-bold'>
                    {DateTime.fromISO(breakData.gameData.startTime).toFormat('hh:mm:ss a')}
                  </span>
                </p>
              ) : (
                <></>
              )}

              {breakData?.gameData?.endTime ? (
                <p>
                  End Time
                  <br />
                  <span className='font-bold'>
                    {DateTime.fromISO(breakData.gameData.endTime).toFormat('hh:mm:ss a')}
                  </span>
                </p>
              ) : (
                <></>
              )}

              {breakData.time ? (
                <>
                  <Divider className='col-span-2' />
                  <p>Total Time</p>
                  <p>
                    {Math.floor(breakData.time / 60) || '00'}hrs {breakData.time % 60 || '00'}mins
                  </p>
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {breakData?.gameData?.endTime ? (
            <>
              <div className='w-full grid grid-cols-2 gap-2 border p-3 rounded-lg'>
                <p>Table Amount</p>
                <p>{`₹${Number(breakData.totalAmount || 0)}`}</p>
              </div>
              {/* <div className='w-full bg-[#E73434] grid grid-cols-2 gap-2 border p-4 mt-2 rounded-lg'>
                <p>Net Pay</p>
                <p>{`₹${data.totalBillAmt}`}</p>
              </div> */}
            </>
          ) : (
            <></>
          )}

          {breakData?.gameData?.players ? (
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
              value={invoiceTo ?? getOptions()[0]}
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
              Resume
            </Button>

            <Button variant='outlined' color='error' onClick={stopGame} disabled={isStopButtonDisabled || !invoiceTo}>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default BreakBill
