'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { TableDataType } from '@/types/adminTypes'
import { CustomerInvoiceType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import { Autocomplete, Avatar, Chip, Divider, Drawer, MenuItem, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type TableBillPropType = {
  open: boolean
  setOpen: (open: boolean) => void
  tableData: TableDataType
  getAllTablesData: () => void
  setGameType: (value: string) => void
  setCustomers: (value: string[]) => void
}

const paymentMethods = ['CASH', 'UPI', 'CARD']

const TableBill = ({ open, setOpen, tableData, getAllTablesData, setGameType, setCustomers }: TableBillPropType) => {
  // States
  const [data, setData] = useState({} as CustomerInvoiceType)
  const [invoiceTo, setInvoiceTo] = useState(
    (data.selectedTable?.gameData?.players || []) as { fullName?: string; customerId?: string }[]
  )

  const [errors, setErrors] = useState({} as { invoiceTo: string })
  const [inputData, setInputData] = useState({
    discount: '',
    paid: '',
    paymentMethod: paymentMethods[0],
    cashIn: ''
  } as {
    discount?: number | string
    paid?: number | string
    paymentMethod: string
    cashIn?: number | string
  })
  const [customerPaymentData, setCustomerPaymentData] = useState(
    {} as { [x: string]: { amount?: number | string; paymentMethod?: string } }
  )

  const netPay = Math.round(data.totalBillAmt - (typeof inputData.discount === 'number' ? inputData.discount : 0))
  const cashOut = Math.round((typeof inputData.cashIn === 'number' ? inputData.cashIn : 0) - data.totalBillAmt)

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const totalSeconds =
    tableData.gameData?.startTime && tableData.gameData?.endTime
      ? DateTime.fromISO(tableData.gameData.endTime).diff(DateTime.fromISO(tableData.gameData.startTime), ['seconds'])
          .seconds
      : 0

  const totalMinutes = Math.ceil(totalSeconds / 60)

  // Now break down total minutes into hours and minutes
  const hours = Math.floor(totalMinutes / 60) // full hours
  const minutes = totalMinutes % 60

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
        if (error?.response?.status === 401) {
          const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
          return router.replace(redirectUrl)
        }
        toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      }
    }
  }

  useEffect(() => {
    getBillData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData._id, open])

  const handleClose = () => {
    setInputData({ discount: '', paid: '', paymentMethod: paymentMethods[0] })
    setOpen(false)
  }

  const handleSubmit = async () => {
    if (invoiceTo.length < 1) {
      setErrors({ invoiceTo: 'This field is required' })
      return
    }

    const customerDetails = []
    if (invoiceTo.length > 1) {
      let totalAmount = 0
      const neyPayable = Math.round(
        data.totalBillAmt - (typeof inputData.discount === 'number' ? inputData.discount : 0)
      )
      for (const name of Object.keys(customerPaymentData)) {
        if (!customerPaymentData[name]?.amount) {
          break
        }
        totalAmount = totalAmount + Number(customerPaymentData[name].amount)

        customerDetails.push({
          customerName: name,
          amount: customerPaymentData[name].amount,
          paymentMethod: customerPaymentData[name].paymentMethod
        })
      }
      if (!customerDetails.length) {
        toast.error('Please provide complete payment details for the customers')
        return
      }

      if (totalAmount > neyPayable) {
        toast.error('Total payable amount can not be more than net pay')
        return
      }
    }

    const requestData = { ...inputData, timeDelta: data.timeDelta, totalBillAmt: data.totalBillAmt, cashOut }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(`${apiBaseUrl}/games/checkoutTable/${tableData._id}`, requestData, {
        headers: { 'auth-token': token }
      })

      if (response && response.data) {
        setGameType(tableData.gameTypes[0] || '')
        setCustomers(['CASH'])
        getAllTablesData()
        handleClose()
        toast.success('Good Job!', { icon: <>👏</> })
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 320, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{tableData.tableName}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <div className='flex flex-col gap-5'>
          {tableData.gameData?.gameType ? (
            <TextField disabled id='gameType' label='Billing' defaultValue={tableData.gameData.gameType}></TextField>
          ) : (
            <></>
          )}
          {/* {data.selectedTable?.gameData?.players ? (
            <Autocomplete
              disabled
              clearIcon={false}
              options={data.selectedTable.gameData.players}
              freeSolo
              multiple
              value={data.selectedTable.gameData.players}
              renderTags={(value, props) =>
                value.map((option, index) => (
                  <Chip
                    size='small'
                    variant='outlined'
                    avatar={<Avatar>{getInitials(option.fullName)}</Avatar>}
                    label={option.fullName}
                    {...props({ index })}
                    key={option.fullName}
                  />
                ))
              }
              renderInput={params => <TextField {...params} variant='outlined' label='Customers' />}
            />
          ) : (
            <></>
          )} */}

          {data.selectedTable?.gameData?.players ? (
            <Autocomplete
              options={data.selectedTable.gameData.players}
              getOptionLabel={option => option.fullName as string}
              multiple
              value={invoiceTo}
              onChange={(_, value) => setInvoiceTo(value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index })
                  return (
                    <Chip
                      size='small'
                      variant='outlined'
                      avatar={option.fullName ? <Avatar>{getInitials(option.fullName)}</Avatar> : <></>}
                      label={option.fullName}
                      {...tagProps}
                      key={key}
                    />
                  )
                })
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Customers'
                  {...(errors.invoiceTo && invoiceTo.length < 1 && { error: true, helperText: errors.invoiceTo })}
                />
              )}
            />
          ) : (
            <></>
          )}

          {invoiceTo.length > 1 ? (
            <div className='w-full grid grid-cols-1  border mt-2 rounded-lg'>
              <div className='w-full grid grid-cols-3 text-center font-bold border-b divide-x'>
                <div className='size-full grid place-items-center'>
                  <p>Customer</p>
                </div>
                <div className='size-full grid place-items-center'>
                  <p>Amount</p>
                </div>
                <div className='size-full grid place-items-center'>
                  <p>Payment Method</p>
                </div>
              </div>

              {invoiceTo.map(customer => (
                <div key={customer.fullName} className='w-full grid grid-cols-3 border-b divide-x'>
                  <div className='size-full grid place-items-center break-all p-2'>
                    <p>{customer.fullName}</p>
                  </div>
                  <div className='size-full grid place-items-center p-2'>
                    <TextField
                      size='small'
                      //placeholder='₹_._'
                      InputProps={{
                        type: 'tel'
                        //startAdornment: <p className='m-2'>Paid</p>
                      }}
                      value={customerPaymentData[customer.fullName as string]?.amount || ''}
                      onChange={event =>
                        setCustomerPaymentData({
                          ...customerPaymentData,
                          [customer.fullName as string]: {
                            ...customerPaymentData[customer.fullName as string],
                            amount: Number(event.target.value) ? Number(event.target.value) : ''
                          }
                        })
                      }
                    />
                  </div>
                  <div className='size-full grid place-items-center p-2'>
                    <TextField
                      className='w-full'
                      size='small'
                      select
                      value={customerPaymentData[customer.fullName as string]?.paymentMethod || paymentMethods[0]}
                      onChange={e => {
                        setCustomerPaymentData({
                          ...customerPaymentData,
                          [customer.fullName as string]: {
                            ...customerPaymentData[customer.fullName as string],
                            paymentMethod: e.target.value
                          }
                        })
                      }}
                    >
                      {paymentMethods.map((paymentMethod, index) => (
                        <MenuItem key={index} value={paymentMethod}>
                          {paymentMethod}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}

          {data.selectedTable?.gameData?.startTime ? (
            <div className='w-full grid grid-cols-2 gap-2 border p-4 mt-2 rounded-lg'>
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
                    {hours || '00'}hrs {minutes || '00'}mins
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
              <div className='w-full grid grid-cols-2 gap-2 border p-4 mt-2 rounded-lg'>
                <p>Table Amount</p>
                <p>{`₹${Math.round(data.totalBillAmt || 0)}`}</p>
                <Divider className='col-span-2' />
                <p>Meals Amount</p>
                <p>{`₹${Math.round(data.mealAmount || 0)}`}</p>
              </div>
              {/* <div className='w-full bg-[#E73434] grid grid-cols-2 gap-2 border p-4 mt-2 rounded-lg'>
                <p>Net Pay</p>
                <p>{`₹${data.totalBillAmt}`}</p>
              </div> */}
            </>
          ) : (
            <></>
          )}

          <div className='w-full grid grid-cols-2 gap-2 mt-2 rounded-lg'>
            <TextField
              //placeholder='₹_._'
              InputProps={{
                type: 'tel'
                //startAdornment: <p className='m-2'>Discount</p>
              }}
              label='Discount'
              value={inputData.discount}
              onChange={event =>
                setInputData({
                  ...inputData,
                  discount: Number(event.target.value) ? Number(event.target.value) : ''
                })
              }
            />
            <TextField
              //className='w-full bg-[#E73434] rounded-lg'
              label='Net Pay'
              value={`₹${netPay}`}
              InputProps={
                {
                  //startAdornment: <p className='m-1'>Net Pay</p>
                }
              }
            />
            {/* <TextField
              label='Paid'
              //placeholder='₹_._'
              InputProps={{
                type: 'tel'
                //startAdornment: <p className='m-2'>Paid</p>
              }}
              value={inputData.paid}
              onChange={event =>
                setInputData({
                  ...inputData,
                  paid: Number(event.target.value) ? Number(event.target.value) : ''
                })
              }
            /> */}
            <TextField
              className='col-span-2'
              label='Payment Method'
              select
              value={inputData.paymentMethod}
              onChange={e => {
                setInputData({ ...inputData, paymentMethod: e.target.value })
              }}
            >
              {paymentMethods.map((paymentMethod, index) => (
                <MenuItem key={index} value={paymentMethod}>
                  {paymentMethod}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label='Cash In'
              //placeholder='₹_._'
              InputProps={{
                type: 'tel'
                //startAdornment: <p className='m-2'>Paid</p>
              }}
              value={inputData.cashIn}
              onChange={event =>
                setInputData({
                  ...inputData,
                  cashIn: Number(event.target.value) ? Number(event.target.value) : ''
                })
              }
            />
            <TextField
              //className='w-full bg-[#E73434] rounded-lg'
              label='Cash Out'
              value={`₹${cashOut}`}
              InputProps={
                {
                  //startAdornment: <p className='m-1'>Net Pay</p>
                }
              }
            />
          </div>

          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleSubmit}>
              Checkout
            </Button>
            <Button variant='outlined' color='error' onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default TableBill
