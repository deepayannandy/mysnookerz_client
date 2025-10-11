'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

// Style Imports
import { SubscriptionPlanType, UserDataType } from '@/types/adminTypes'
import { Checkbox, FormControlLabel } from '@mui/material'
import axios from 'axios'
import _ from 'lodash'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Script from 'next/script'
import { toast } from 'react-toastify'

type UpgradePlanProps = {
  open: boolean
  setOpen: (open: boolean) => void
  currentPlan?: SubscriptionPlanType
  getUserData: () => void
  userData: UserDataType
  renewPlan: boolean
  isLoginScreen?: boolean
}

type OrderDetailsType = { orderId: string; amount: string; currency: string; receipt: string }

type PaymentDetailsType = {
  orderCreationId: string
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
}

const UpgradePlan = ({
  open,
  setOpen,
  currentPlan,
  getUserData,
  userData,
  renewPlan,
  isLoginScreen
}: UpgradePlanProps) => {
  // States
  const [subscriptionList, setSubscriptionList] = useState(
    [] as {
      _id: string
      displayName: string
      subscriptionName: string
      subscriptionPrice: number
      subscriptionGlobalPrice: number
    }[]
  )
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlan?.subscriptionId ?? '')
  const [isCurrencyUpdated, setIsCurrencyUpdated] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState([] as SubscriptionPlanType[])

  const selectedPlan = subscriptionList.find(subs => subs._id === selectedPlanId)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    setSelectedPlanId('')
    if (isLoginScreen) {
      localStorage.removeItem('token')
    }
  }

  const getSubscriptions = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`${apiBaseUrl}/subscription`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setSubscriptionData(response.data)
        const list = [] as {
          _id: string
          displayName: string
          subscriptionName: string
          subscriptionPrice: number
          subscriptionGlobalPrice: number
        }[]

        response.data.forEach((data: any) => {
          if (renewPlan || Number(data.subscriptionPrice ?? 0) >= Number(currentPlan?.subscriptionAmount ?? 0))
            list.push({
              ...data,
              displayName: `${data.subscriptionName} - ₹${data.subscriptionPrice}`
            })
        })
        setSubscriptionList(list)

        setSelectedPlanId(currentPlan?.subscriptionId ?? list[0]?._id)
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
    getSubscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleCurrencyUpdate = (checked: boolean) => {
    setIsCurrencyUpdated(checked)
    const list = [] as {
      _id: string
      displayName: string
      subscriptionName: string
      subscriptionPrice: number
      subscriptionGlobalPrice: number
    }[]

    subscriptionData.forEach((data: any) => {
      if (
        renewPlan ||
        Number((checked ? data.subscriptionGlobalPrice : data.subscriptionPrice) ?? 0) >=
          Number(currentPlan?.subscriptionAmount ?? 0)
      )
        list.push({
          ...data,
          displayName: `${data.subscriptionName} - ${checked ? `$${data.subscriptionGlobalPrice ?? 0}` : `₹${data.subscriptionPrice ?? 0}`}`
        })
    })
    setSubscriptionList(list)
  }

  const createPaymentLogs = async (orderDetails: OrderDetailsType): Promise<{ success: boolean } | void> => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.post(`${apiBaseUrl}/paymentLogs`, orderDetails, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        return { success: true }
      }
      throw new Error('Something went wrong. Please try after sometime.')
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      throw new Error(error?.response?.data?.message ?? error?.message)
    }
  }

  const updatePaymentLogs = async (paymentDetails: PaymentDetailsType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.patch(
        `${apiBaseUrl}/paymentLogs/${paymentDetails.orderCreationId}`,
        _.omit(paymentDetails, 'orderCreationId'),
        {
          headers: { 'auth-token': token }
        }
      )
      if (response && response.data) {
        return { success: true }
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      throw new Error(error?.response?.data?.message ?? error?.message)
    }
  }

  const upgradeSubscriptionPlan = async (orderId: string) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.post(
        `${apiBaseUrl}/storeSubscription`,
        { storeId, subscriptionId: selectedPlanId, transactionRef: orderId },
        { headers: { 'auth-token': token } }
      )
      if (response && response.data) {
        getUserData()
        handleClose()
        toast.success('Plan updated successfully')
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const createOrderId = async (amount: number, currency: string) => {
    try {
      const response = await axios.post(
        '/api/order',
        { amount, currency },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response && response.data) {
        await createPaymentLogs(response.data)
        return response.data
      }
      return {}
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      return {}
    }
  }

  const verifyPayment = async (response: any, orderDetails: OrderDetailsType) => {
    const data = {
      orderCreationId: orderDetails.orderId,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature
    }

    try {
      const result = await axios.post('/api/payment/verify', data, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (result && result.data && result.data.success) {
        await updatePaymentLogs(data)
        toast.success('Payment successful')
        upgradeSubscriptionPlan(orderDetails.orderId)
      } else {
        toast.error(result?.data?.message ?? 'Something went wrong. Please try again.')
      }
    } catch (error: any) {
      toast.error(
        `We are facing some problem at this moment, please try after sometime. ${error?.response?.data?.message ?? error?.message}`,
        { hideProgressBar: false }
      )
    }
  }

  const processPayment = async () => {
    try {
      const amount = `${(((isCurrencyUpdated ? selectedPlan?.subscriptionGlobalPrice : selectedPlan?.subscriptionPrice) || 0) + (((isCurrencyUpdated ? selectedPlan?.subscriptionGlobalPrice : selectedPlan?.subscriptionPrice) || 0) * 18) / 100).toFixed(2)}`
      const orderDetails: OrderDetailsType = await createOrderId(
        Math.round(Number(amount)),
        isCurrencyUpdated ? 'USD' : 'INR'
      )

      if (orderDetails.orderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderDetails.amount,
          currency: orderDetails.currency,
          name: 'CueKeeper Subscription',
          description: `Payment for subscription`,
          order_id: orderDetails.orderId,
          handler: (response: any) => verifyPayment(response, orderDetails),
          prefill: {
            name: userData?.clientName,
            contact: userData?.StoreData?.contact
          }
          // theme: {
          //   color: '#3399cc'
          // }
        }
        console.log(options)
        const paymentObject = new (window as any).Razorpay(options)
        paymentObject.on('payment.failed', function (response: any) {
          toast.error(response.error.description)
        })
        paymentObject.open()
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <>
      <Script id='razorpay-checkout-js' src='https://checkout.razorpay.com/v1/checkout.js' />
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          {currentPlan?.subscriptionName ? 'Renew Plan' : 'Buy Subscription'}
          <Typography component='span' className='flex flex-col text-center'>
            Choose the best plan
          </Typography>
        </DialogTitle>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16 sm:pbe-16'>
          <IconButton onClick={() => handleClose()} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line' />
          </IconButton>
          <div className='flex items-center gap-4 flex-col sm:flex-row'>
            {!renewPlan ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCurrencyUpdated}
                    onChange={event => handleCurrencyUpdate(event.target.checked)}
                  />
                }
                label='USD'
              />
            ) : (
              <></>
            )}
            <FormControl fullWidth size='small'>
              <InputLabel id='user-view-plans-select-label'>Choose Plan</InputLabel>
              <Select
                disabled={renewPlan}
                label='Choose Plan'
                defaultValue='Standard'
                id='user-view-plans-select'
                labelId='user-view-plans-select-label'
                value={selectedPlanId}
                onChange={event => setSelectedPlanId(event.target.value)}
              >
                {subscriptionList.map(
                  (subscription: {
                    _id: string
                    displayName: string
                    subscriptionName: string
                    subscriptionPrice: number
                  }) => (
                    <MenuItem key={subscription._id} value={subscription._id}>
                      {subscription.displayName}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <Button variant='contained' className='capitalize sm:is-auto is-full' onClick={processPayment}>
              {isLoginScreen
                ? selectedPlanId === currentPlan?.subscriptionId
                  ? 'Renew'
                  : 'Upgrade'
                : renewPlan
                  ? 'Renew'
                  : 'Upgrade'}
            </Button>
          </div>
          <Divider className='mlb-6' />
          {selectedPlanId ? (
            <div className='flex flex-col gap-1'>
              {selectedPlanId === currentPlan?.subscriptionId ? (
                <Typography>{`Current plan is ${currentPlan?.subscriptionName} plan`}</Typography>
              ) : (
                <></>
              )}
              <div className='flex items-center justify-between flex-wrap gap-2'>
                <div className='w-full grid grid-cols-2 gap-2 border p-3 rounded-lg'>
                  <p>Amount</p>
                  <p>{`₹${selectedPlan?.subscriptionPrice || 0}`}</p>
                  {/* <Divider className='col-span-2' /> */}

                  <p>Tax @ 18%</p>
                  <p>{`₹${((selectedPlan?.subscriptionPrice || 0) * 18) / 100}`}</p>

                  <p>Net Pay</p>
                  <p>{`₹${((selectedPlan?.subscriptionPrice || 0) + ((selectedPlan?.subscriptionPrice || 0) * 18) / 100).toFixed(2)}`}</p>
                </div>
                {/* <div className='flex justify-center items-baseline gap-1'>
                  <Typography component='sup' className='self-start' color='primary'>
                    ₹
                  </Typography>
                  <Typography component='span' color='primary' variant='h1'>
                    {currentPlan.subscriptionAmount ?? 0}
                  </Typography>
                  <Typography component='sub' className='self-baseline' variant='body2'>
                    /month
                  </Typography>
                </div> */}
                {/* <Button
                  variant='outlined'
                  className='capitalize'
                  color='error'
                  onClick={() => setOpenConfirmation(true)}
                >
                  Cancel Subscription
                </Button> */}
              </div>
            </div>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UpgradePlan
