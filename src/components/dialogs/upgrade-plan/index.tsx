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
import { SubscriptionPlanType } from '@/types/adminTypes'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../confirmation-dialog'

type UpgradePlanProps = {
  open: boolean
  setOpen: (open: boolean) => void
  currentPlan?: SubscriptionPlanType
  getUserData: () => void
  renewPlan: boolean
}

const UpgradePlan = ({ open, setOpen, currentPlan, getUserData, renewPlan }: UpgradePlanProps) => {
  // States
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [subscriptionList, setSubscriptionList] = useState(
    [] as { _id: string; displayName: string; subscriptionName: string; subscriptionPrice: number }[]
  )
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlan?.subscriptionId ?? '')

  const selectedPlan = subscriptionList.find(subs => subs._id === selectedPlanId)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    setSelectedPlanId('')
  }

  const getSubscriptions = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`${apiBaseUrl}/subscription`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        const list = [] as { _id: string; displayName: string; subscriptionName: string; subscriptionPrice: number }[]

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

  const upgradeSubscriptionPLan = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.post(
        `${apiBaseUrl}/storeSubscription`,
        { storeId, subscriptionId: selectedPlanId },
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

  return (
    <>
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
            <Button variant='contained' className='capitalize sm:is-auto is-full' onClick={upgradeSubscriptionPLan}>
              {renewPlan ? 'Renew' : 'Upgrade'}
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
                  <p>{`₹${(selectedPlan?.subscriptionPrice || 0) + ((selectedPlan?.subscriptionPrice || 0) * 18) / 100}`}</p>
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
      <ConfirmationDialog open={openConfirmation} setOpen={setOpenConfirmation} type='unsubscribe' />
    </>
  )
}

export default UpgradePlan
