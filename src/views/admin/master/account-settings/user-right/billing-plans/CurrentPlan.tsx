'use client'

// MUI Imports
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

// Type Imports
import type { PricingPlanType } from '@/types/pages/pricingTypes'
import type { ThemeColor } from '@core/types'

// Component Imports
import { UserDataType } from '@/types/adminTypes'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import UpgradePlan from '@components/dialogs/upgrade-plan'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CurrentPlan = ({ data }: { data?: PricingPlanType[] }) => {
  // Vars
  const buttonProps = (children: string, variant: ButtonProps['variant'], color: ThemeColor): ButtonProps => ({
    children,
    variant,
    color
  })

  const [userData, setUserData] = useState({} as UserDataType)

  const daysPast =
    typeof userData?.SubscriptionData === 'object' && userData?.SubscriptionData?.startDate
      ? Math.round(DateTime.now().diff(DateTime.fromISO(userData.SubscriptionData?.startDate), 'days').days)
      : 0

  const getUserData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setUserData(response.data)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='Current Plan' />
      {typeof userData?.SubscriptionData !== 'object' ? (
        <CardContent className='flex flex-col gap-6'>
          <Typography className='font-medium' color='text.primary'>
            No active subscription
          </Typography>
        </CardContent>
      ) : (
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} className='flex flex-col gap-4'>
              <div>
                <Typography className='font-medium text-textPrimary'>{`Your Current Plan is ${userData?.SubscriptionData?.subscriptionName}`}</Typography>
                <Typography>A simple start for everyone</Typography>
              </div>
              <div>
                <Typography className='font-medium' color='text.primary'>
                  {`Active until ${userData?.SubscriptionData?.endDate ? DateTime.fromISO(userData.SubscriptionData.endDate).toFormat('dd LLL yyyy') : ''}`}
                </Typography>
                <Typography>We will send you a notification upon Subscription expiration</Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <Typography className='font-medium' color='text.primary'>
                    {`₹${userData?.SubscriptionData?.subscriptionAmount} Per Month`}
                  </Typography>
                  <Chip color='primary' label='Popular' size='small' variant='tonal' />
                </div>
                <Typography>Standard plan for small to medium businesses</Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              {(userData?.SubscriptionData?.subscriptionValidity || 0) - daysPast <= 5 ? (
                <Alert severity='warning' onClose={() => {}} className='mbe-4'>
                  <AlertTitle>We need your attention!</AlertTitle>
                  Your plan requires update
                </Alert>
              ) : (
                <></>
              )}
              <div className='flex items-center justify-between'>
                <Typography className='font-medium' color='text.primary'>
                  Days
                </Typography>
                <Typography className='font-medium' color='text.primary'>
                  {`${daysPast} of 30 Days`}
                </Typography>
              </div>
              <LinearProgress
                variant='determinate'
                value={Math.round((daysPast * 100) / (userData?.SubscriptionData?.subscriptionValidity || 1))}
                className='mlb-1 bs-2.5'
              />
              {(userData?.SubscriptionData?.subscriptionValidity || 0) - daysPast <= 5 ? (
                <Typography variant='body2'>Your plan requires update</Typography>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Upgrade plan', 'contained', 'primary')}
                dialog={UpgradePlan}
                dialogProps={{ data: data }}
              />
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Cancel Subscription', 'outlined', 'error')}
                dialog={ConfirmationDialog}
                dialogProps={{ type: 'unsubscribe' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      )}
    </Card>
  )
}

export default CurrentPlan
