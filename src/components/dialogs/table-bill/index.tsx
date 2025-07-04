'use client'

// React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// MUI Imports
import { StoreDataType, TableDataType } from '@/types/adminTypes'
import { CustomerInvoiceType, CustomerListType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import {
  Autocomplete,
  Avatar,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { BillPrintDataType } from '@/components/BillPrint'
import { getPlanAccessControl } from '@/utils/Utils'

type TableBillPropType = {
  open: boolean
  setOpen: (open: boolean) => void
  isOnHoldBill: boolean
  setShowOnHoldBill: (value: boolean) => void
  tableData: TableDataType
  customersList: CustomerListType[]
  getAllTablesData: () => void
  setGameType?: (value: string) => void
  setCustomers?: (value: string[]) => void
  getCustomerData: () => void
  setBillData: (value: BillPrintDataType) => void
  setBillPrint: (value: boolean) => void
}

const paymentMethods = ['CASH', 'UPI', 'CARD']

const TableBill = ({
  open,
  setOpen,
  isOnHoldBill,
  setShowOnHoldBill,
  tableData,
  customersList,
  getAllTablesData,
  // setGameType,
  // setCustomers,
  getCustomerData,
  setBillData,
  setBillPrint
}: TableBillPropType) => {
  // States
  const [data, setData] = useState({} as CustomerInvoiceType)
  const [storeData, setStoreData] = useState({} as StoreDataType)
  const [isAutoSplitSelected, setIsAutoSplitSelected] = useState(false)
  const [isBestOfAllSelected, setIsBestOfAllSelected] = useState(false)
  const [isBreakBilling, setIsBreakBilling] = useState(false)

  const [invoiceTo, setInvoiceTo] = useState(
    (data.selectedTable?.gameData?.players || []) as (CustomerListType | string)[]
  )

  const [errors, setErrors] = useState({} as { invoiceTo: string })
  const [inputData, setInputData] = useState({
    discount: '',
    paymentMethod: paymentMethods[0],
    cashIn: ''
  } as {
    discount?: number | string
    paymentMethod: string
    cashIn?: number | string
  })
  const [customerPaymentData, setCustomerPaymentData] = useState(
    {} as { [x: string]: { amount?: number | string; paymentMethod?: string; cashIn?: number | string } }
  )
  const [mealsPaymentData, setMealsPaymentData] = useState(
    {} as { [x: string]: { paid?: number | string; paymentMethod?: string } }
  )
  const [isCheckoutButtonDisabled, setIsCheckoutButtonDisabled] = useState(false)
  const [isAddToWalletSelected, setIsAddToWalletSelected] = useState(false)
  const [isHappyHour, setIsHappyHour] = useState(false)
  const [happyHourDiscount, setHappyHourDiscount] = useState(0)

  const planAccessControl = getPlanAccessControl()

  const netPay = (Number(data.totalBillAmt || 0) - Number(inputData.discount ?? 0)).toFixed(2)
  const cashOut = (Number(inputData.cashIn ?? 0) - Number(netPay ?? 0)).toFixed(2)

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
        const endpoint = isOnHoldBill ? 'getOnHold' : 'getBilling'
        const response = await axios.get(`${apiBaseUrl}/games/${endpoint}/${tableData._id}`, {
          headers: { 'auth-token': token }
        })
        if (response && response.data) {
          setData(response.data)

          if (response.data.selectedTable?.breakPlayers?.length) {
            const data = response.data as CustomerInvoiceType
            setIsBreakBilling(true)
            const breakPlayersId = data.selectedTable.breakPlayers.map(player => player.customerId)

            const playersList = customersList.filter(customer => breakPlayersId.includes(customer.customerId))

            setInvoiceTo(playersList)

            let paymentMethodData = customerPaymentData
            for (const customer of playersList) {
              const breakPlayer = data.selectedTable.breakPlayers.find(
                player => player.customerId === customer.customerId
              )
              paymentMethodData = {
                ...paymentMethodData,
                [(customer as CustomerListType).fullName ?? customer]: {
                  ...customerPaymentData[(customer as CustomerListType).fullName ?? customer],
                  paymentMethod: 'CASH',
                  amount: breakPlayer?.billingAmount ?? undefined
                }
              }
            }
            setCustomerPaymentData(paymentMethodData)
            setInputData({
              ...inputData,
              cashIn: (response.data.totalBillAmt - Number(response.data.discount ?? 0)).toFixed(2)
            })
          }
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

  const getStoreData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setStoreData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getBillData()
    getCustomerData()
    getStoreData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData._id, open])

  useEffect(() => {
    if (
      storeData?.StoreData?.happyHrsStartTime &&
      storeData?.StoreData?.happyHrsEndTime &&
      storeData?.StoreData?.happyHrsDiscount &&
      data?.totalBillAmt &&
      data.selectedTable?.gameData?.startTime &&
      planAccessControl.happyHours
    ) {
      const tableStartTime = DateTime.fromISO(data.selectedTable.gameData.startTime)
      const formattedStartDate = tableStartTime.toFormat('dd-MM-yyyy')
      const happyHourStartTime = DateTime.fromFormat(
        `${formattedStartDate} ${storeData.StoreData.happyHrsStartTime}`,
        'dd-MM-yyyy HH:mm'
      )
      const happyHourEndTime = DateTime.fromFormat(
        `${formattedStartDate} ${storeData.StoreData.happyHrsEndTime}`,
        'dd-MM-yyyy HH:mm'
      )

      if (happyHourStartTime <= tableStartTime && tableStartTime <= happyHourEndTime) {
        const happyHourDiscount =
          ((Number(data.totalBillAmt) ?? 0) * Number(storeData.StoreData.happyHrsDiscount)) / 100

        setIsHappyHour(true)
        setHappyHourDiscount(happyHourDiscount)
        setInputData({
          ...inputData,
          discount: happyHourDiscount
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeData, data])

  const handleClose = () => {
    setInputData({ discount: '', paymentMethod: paymentMethods[0], cashIn: '' })
    setShowOnHoldBill(false)
    setOpen(false)
  }

  const handleSubmit = async () => {
    setIsCheckoutButtonDisabled(true)
    setTimeout(() => setIsCheckoutButtonDisabled(false), 3000)

    if (invoiceTo.length < 1) {
      setErrors({ invoiceTo: 'This field is required' })
      return
    }

    const players = invoiceTo.map(customer => {
      if (typeof customer === 'string') {
        return { fullName: customer }
      }
      return customer
    })

    const checkoutPlayers = []
    if (players.length > 1) {
      let totalAmount = 0
      for (const name of Object.keys(customerPaymentData)) {
        if (!customerPaymentData[name]?.amount) {
          break
        }

        totalAmount = totalAmount + Number(customerPaymentData[name].amount)

        const customerData = players.find(data => data.fullName === name)

        if (!customerData) {
          toast.error('Incorrect customer data')
          return
        }

        if (Number(customerPaymentData[name].cashIn ?? 0) > Number(customerPaymentData[name].amount ?? 0)) {
          toast.error('Cash In can not be more than amount')
          return
        }

        checkoutPlayers.push({
          ...customerData,
          amount: customerPaymentData[name].amount,
          paymentMethod: customerPaymentData[name].paymentMethod,
          cashIn: customerPaymentData[name].cashIn ?? 0
        })
      }
      if (checkoutPlayers?.length !== players?.length) {
        toast.error('Please provide complete payment details for the customers')
        return
      }

      if (totalAmount > Number(netPay ?? 0)) {
        toast.error('Total payable amount can not be more than net pay')
        return
      }
    } else {
      if (Number(inputData.cashIn ?? 0) > Number(netPay ?? 0)) {
        inputData.cashIn = netPay
      }

      checkoutPlayers.push({
        ...players[0],
        amount: netPay,
        paymentMethod: inputData.paymentMethod,
        cashIn: inputData.cashIn ?? 0
      })
    }

    const mealSettlement: {
      customerDetails: CustomerListType
      payable: number
      paid: number | string
      paymentMethod: string
    }[] = []
    if (data.productList?.length) {
      data.productList.map(product => {
        mealSettlement.push({
          customerDetails: product.customerDetails,
          payable: product.orderTotal,
          paid: mealsPaymentData[product.customerDetails.customerId]?.paid ?? 0,
          paymentMethod: mealsPaymentData[product.customerDetails.customerId]?.paymentMethod ?? ''
        })
      })
    }

    const itemBillData = {
      startTime: DateTime.fromISO(data.selectedTable.gameData.startTime).toFormat('hh:mm:ss a'),
      endTime: DateTime.fromISO(data.selectedTable.gameData.endTime).toFormat('hh:mm:ss a'),
      totalTime: `${Math.floor(data.timeDelta / 60) || '00'}hrs ${data.timeDelta % 60 || '00'}mins`,
      gameType: data?.selectedTable?.gameData?.gameType,
      gameAmount: data?.totalBillAmt,
      mealAmount: data?.mealTotal
    }

    const inputDetails = _.omit(inputData, 'paymentMethod')
    const requestData = {
      ...inputDetails,
      timeDelta: data.timeDelta,
      totalBillAmt: data.totalBillAmt,
      cashOut,
      checkoutPlayers,
      mealSettlement,
      addToWallet: isAddToWalletSelected,
      ...(isOnHoldBill ? { fromHold: true } : {})
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(`${apiBaseUrl}/games/checkoutTable/${tableData._id}`, requestData, {
        headers: { 'auth-token': token }
      })

      if (response && response.data) {
        // setGameType(tableData.gameTypes[0] || '')
        // setCustomers(['CASH'])
        getAllTablesData()
        handleClose()
        toast.success('Good Job!', { icon: <>👏</> })

        setBillData({
          billNo: response.data.transactionId ?? '#123123',
          tableName: tableData.tableName,
          server: localStorage.getItem('clientName') ?? '',
          isTableBilling: true,
          tableBillData: itemBillData,
          subTotal: Number(data?.totalBillAmt || 0) + Number(data?.mealTotal || 0),
          discount: inputData.discount,
          total: `${Number(data?.totalBillAmt || 0) + Number(data?.mealTotal || 0) - Number(inputData.discount || 0)}`
        })
        setBillPrint(true)
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const handleCustomerPaymentDataChange = ({
    value,
    field,
    fullName
  }: {
    value: string
    field: string
    fullName?: string
  }) => {
    let resetCashIn = {}
    if (
      field === 'amount' &&
      Number(value ?? 0) < (Number(customerPaymentData[fullName as string]?.cashIn ?? 0) ?? 0)
    ) {
      resetCashIn = { cashIn: '' }
    }
    setCustomerPaymentData({
      ...customerPaymentData,
      [fullName as string]: {
        ...customerPaymentData[fullName as string],
        [field]: value,
        ...resetCashIn
      }
    })

    if (field === 'amount') {
      let cashInValue = Number(value ?? 0)
      Object.keys(customerPaymentData).forEach(data => {
        if (data !== fullName) {
          cashInValue =
            cashInValue +
            (customerPaymentData[data]?.amount && Number(customerPaymentData[data]?.amount)
              ? Number(customerPaymentData[data]?.amount)
              : 0)
        }
      })

      setInputData({
        ...inputData,
        cashIn: cashInValue
      })
    }
  }

  const handleMealsPaymentDataChange = ({
    value,
    field,
    customerId
  }: {
    value: string
    field: string
    customerId: string
  }) => {
    setMealsPaymentData({
      ...mealsPaymentData,
      [customerId]: {
        ...mealsPaymentData[customerId],
        [field]: value
      }
    })
  }

  const handleCustomerChange = (value: (string | CustomerListType)[]) => {
    if (value.length > 1) {
      let paymentMethodData = customerPaymentData
      for (const customer of value) {
        paymentMethodData = {
          ...paymentMethodData,
          [(customer as CustomerListType).fullName ?? customer]: {
            ...customerPaymentData[(customer as CustomerListType).fullName ?? customer],
            paymentMethod: 'CASH'
          }
        }
      }
      setCustomerPaymentData(paymentMethodData)
    }

    setInvoiceTo(value)
  }

  const handleAutoSplit = (event: ChangeEvent<HTMLInputElement>) => {
    setIsAutoSplitSelected(event.target.checked)

    if (event.target.checked) {
      const value = Number(netPay ?? 0) / (invoiceTo.length ?? 1)

      const paymentData = customerPaymentData

      invoiceTo.map(customer => {
        const name = (customer as CustomerListType)?.fullName ?? (customer as string)
        let resetCashIn = {}
        if (Number(value ?? 0) < (Number(customerPaymentData[name]?.cashIn ?? 0) ?? 0)) {
          resetCashIn = { cashIn: '' }
        }

        paymentData[name] = {
          ...paymentData[name],
          amount: value.toFixed(2),
          ...resetCashIn
        }
      })

      setCustomerPaymentData(paymentData)
      setInputData({
        ...inputData,
        cashIn: netPay ?? 0
      })
    } else {
      const paymentData = customerPaymentData

      invoiceTo.map(customer => {
        const name = (customer as CustomerListType)?.fullName ?? (customer as string)

        paymentData[name] = {
          ...paymentData[name],
          amount: ''
        }
      })

      setCustomerPaymentData(paymentData)
      setInputData({
        ...inputData,
        cashIn: ''
      })
    }
  }

  const handleBestOfAll = (event: ChangeEvent<HTMLInputElement>) => {
    setIsBestOfAllSelected(event.target.checked)

    if (event.target.checked) {
      const breakPlayers = data.selectedTable?.breakPlayers ?? []
      let bestOfAllCustomerId = ''
      let bestOfAllAmount = 0
      for (const player of breakPlayers) {
        if ((player.billingAmount ?? 0) > bestOfAllAmount) {
          bestOfAllCustomerId = player.customerId
          bestOfAllAmount = player.billingAmount
        }
      }

      if (bestOfAllCustomerId) {
        const bestOfAllCustomer = customersList.find(customer => customer.customerId === bestOfAllCustomerId)
        if (bestOfAllCustomer) {
          const value = Number(netPay ?? 0)
          const name = bestOfAllCustomer.fullName

          let resetCashIn = {}
          if (Number(value ?? 0) < (Number(customerPaymentData[name]?.cashIn ?? 0) ?? 0)) {
            resetCashIn = { cashIn: '' }
          }
          setInvoiceTo([bestOfAllCustomer])

          setCustomerPaymentData({
            name: {
              amount: value.toFixed(2),
              paymentMethod: 'CASH',
              ...resetCashIn
            }
          })
          setInputData({
            ...inputData,
            cashIn: Number(netPay ?? 0)
          })
        }
      }
    }
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

          {data.selectedTable?.gameData?.players ? (
            <Autocomplete
              size='small'
              disableClearable
              disabled={isBreakBilling}
              options={getOptions()}
              getOptionLabel={option => (option as CustomerListType)?.fullName ?? option}
              groupBy={option => (option as CustomerListType & { group: string }).group}
              getOptionKey={option => (option as CustomerListType).customerId}
              multiple
              freeSolo
              value={invoiceTo}
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
                  label='Customers'
                  {...(errors.invoiceTo && invoiceTo.length < 1 && { error: true, helperText: errors.invoiceTo })}
                />
              )}
            />
          ) : (
            <></>
          )}

          {invoiceTo.length > 1 ? (
            <>
              {tableData.isBreak ? (
                <FormControlLabel
                  label='Best of all'
                  control={<Checkbox checked={isBestOfAllSelected} onChange={event => handleBestOfAll(event)} />}
                />
              ) : (
                <FormControlLabel
                  label='Auto split'
                  control={<Checkbox checked={isAutoSplitSelected} onChange={event => handleAutoSplit(event)} />}
                />
              )}
              <div className='w-full grid grid-cols-1 border rounded-lg overflow-x-auto '>
                <div className='w-full grid grid-cols-4 text-center font-bold border-b divide-x'>
                  <div className='size-full grid place-items-center  p-1 sm:p-2 '>
                    <p>Customer</p>
                  </div>
                  <div className='size-full grid place-items-center  p-1 sm:p-2'>
                    <p>Amount</p>
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <p>Cash In</p>
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <p>Payment Method</p>
                  </div>
                </div>

                {invoiceTo.map(customer => (
                  <div
                    key={
                      ((customer as CustomerListType).fullName
                        ? (customer as CustomerListType).fullName
                        : customer) as string
                    }
                    className='w-full grid grid-cols-4 border-b divide-x'
                  >
                    <div className='size-full grid place-items-center break-all p-1 sm:p-2'>
                      <p>
                        {
                          ((customer as CustomerListType).fullName
                            ? (customer as CustomerListType).fullName
                            : customer) as string
                        }
                      </p>
                    </div>
                    <div className='size-full grid place-items-center p-1 sm:p-2'>
                      <TextField
                        size='small'
                        //placeholder='₹_._'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={
                          customerPaymentData[
                            ((customer as CustomerListType).fullName
                              ? (customer as CustomerListType).fullName
                              : customer) as string
                          ]?.amount || ''
                        }
                        onChange={event =>
                          handleCustomerPaymentDataChange({
                            value: event.target.value,
                            fullName: ((customer as CustomerListType).fullName
                              ? (customer as CustomerListType).fullName
                              : customer) as string,
                            field: 'amount'
                          })
                        }
                      />
                    </div>
                    <div className='size-full grid place-items-center p-1 sm:p-2'>
                      <TextField
                        size='small'
                        //placeholder='₹_._'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={
                          customerPaymentData[
                            ((customer as CustomerListType).fullName
                              ? (customer as CustomerListType).fullName
                              : customer) as string
                          ]?.cashIn || ''
                        }
                        onChange={event =>
                          handleCustomerPaymentDataChange({
                            value: event.target.value,
                            fullName: ((customer as CustomerListType).fullName
                              ? (customer as CustomerListType).fullName
                              : customer) as string,
                            field: 'cashIn'
                          })
                        }
                      />
                    </div>
                    <div className='size-full grid place-items-center p-1 sm:p-2'>
                      <TextField
                        className='min-w-fit'
                        size='small'
                        select
                        value={
                          customerPaymentData[
                            ((customer as CustomerListType).fullName
                              ? (customer as CustomerListType).fullName
                              : customer) as string
                          ]?.paymentMethod || paymentMethods[0]
                        }
                        onChange={e => {
                          handleCustomerPaymentDataChange({
                            value: e.target.value,
                            fullName: ((customer as CustomerListType).fullName
                              ? (customer as CustomerListType).fullName
                              : customer) as string,
                            field: 'paymentMethod'
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
            </>
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

          {data.productList?.length ? (
            <div className='w-full grid grid-cols-1 border rounded-lg overflow-x-auto '>
              <div className='w-full text-center font-bold border-b p-1 sm:p-2'>Meal Order Details</div>
              <div className='w-full grid grid-cols-4 text-center font-bold border-b divide-x'>
                <div className='size-full grid place-items-center p-1 sm:p-2 '>
                  <p>Customer</p>
                </div>
                <div className='size-full grid place-items-center p-1 sm:p-2'>
                  <p>Amount</p>
                </div>
                <div className='size-full grid place-items-center p-1 sm:p-2'>
                  <p>Paid</p>
                </div>
                <div className='size-full grid place-items-center p-1 sm:p-2'>
                  <p>Payment Method</p>
                </div>
              </div>

              {data.productList.map((orderItem, index) => (
                <div
                  key={orderItem._id}
                  className={`w-full grid grid-cols-4 divide-x ${(data.productList?.length ?? 0) - 1 !== index ? 'border-b' : ''}`}
                >
                  <div className='size-full grid place-items-center break-all p-1 sm:p-2'>
                    <p>{orderItem?.customerDetails?.fullName}</p>
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <p>{`₹${orderItem.orderTotal}`}</p>
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <TextField
                      size='small'
                      //placeholder='₹_._'
                      inputProps={{ type: 'number', min: 0, step: 'any' }}
                      value={mealsPaymentData[orderItem.customerDetails.customerId]?.paid || ''}
                      onChange={event =>
                        handleMealsPaymentDataChange({
                          value: event.target.value,
                          customerId: orderItem.customerDetails.customerId,
                          field: 'paid'
                        })
                      }
                    />
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <TextField
                      className='min-w-fit'
                      size='small'
                      select
                      value={mealsPaymentData[orderItem.customerDetails.customerId]?.paymentMethod || paymentMethods[0]}
                      onChange={e => {
                        handleMealsPaymentDataChange({
                          value: e.target.value,
                          customerId: orderItem.customerDetails.customerId,
                          field: 'paymentMethod'
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

          {data.selectedTable?.gameData?.endTime ? (
            <>
              <div className='w-full grid grid-cols-2 gap-2 border p-3 rounded-lg'>
                <p>Table Amount</p>
                <p>{`₹${data.totalBillAmt || 0}`}</p>

                {isHappyHour && happyHourDiscount ? (
                  <>
                    <p>{`Happy Hour Discount @${storeData?.StoreData?.happyHrsDiscount}%`}</p>
                    <p>{`₹${happyHourDiscount}`}</p>
                  </>
                ) : (
                  <></>
                )}
                <Divider className='col-span-2' />

                <p>Meals Amount</p>
                <p>{`₹${data.mealTotal || 0}`}</p>
              </div>
              {/* <div className='w-full bg-[#E73434] grid grid-cols-2 gap-2 border p-4 mt-2 rounded-lg'>
                <p>Net Pay</p>
                <p>{`₹${data.totalBillAmt}`}</p>
              </div> */}
            </>
          ) : (
            <></>
          )}

          <div className='w-full grid grid-cols-2 gap-2 rounded-lg'>
            <TextField
              //placeholder='₹_._'
              inputProps={{ type: 'number', min: 0, step: 'any' }}
              label='Discount'
              disabled={!planAccessControl.discount}
              size='small'
              value={inputData.discount}
              onChange={event =>
                setInputData({
                  ...inputData,
                  discount: event.target.value
                })
              }
            />
            <TextField
              //className='w-full bg-[#E73434] rounded-lg'
              disabled
              label='Net Pay'
              size='small'
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
            {invoiceTo?.length <= 1 ? (
              <TextField
                size='small'
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
            ) : (
              <></>
            )}
            <TextField
              disabled={invoiceTo?.length > 1}
              label='Cash In'
              size='small'
              InputProps={{
                startAdornment: <p className='m-1'>₹</p>
              }}
              //placeholder='₹_._'
              inputProps={{ type: 'number', min: 0, step: 'any' }}
              value={inputData.cashIn}
              onChange={event =>
                setInputData({
                  ...inputData,
                  cashIn: event.target.value
                })
              }
            />
            <TextField
              //className='w-full bg-[#E73434] rounded-lg'
              disabled
              label='Cash Out'
              size='small'
              value={`₹${cashOut}`}
              InputProps={
                {
                  //startAdornment: <p className='m-1'>Net Pay</p>
                }
              }
            />
          </div>
          {Number(cashOut) > 0 ? (
            <FormControlLabel
              label='Add to Wallet'
              control={
                <Checkbox
                  checked={isAddToWalletSelected}
                  onChange={event => setIsAddToWalletSelected(event.target.checked)}
                />
              }
            />
          ) : (
            <></>
          )}

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={isCheckoutButtonDisabled || (invoiceTo?.length > 1 && Number(cashOut) !== 0)}
            >
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
