'use client'

// MUI Imports
import type { ButtonProps } from '@mui/material/Button'
import MuiButton from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import UpgradeMembership from '@/components/dialogs/upgrade-membership'
import { CustomerDetailsDataType } from '@/types/staffTypes'
import { Chip, LinearProgress } from '@mui/material'
import { DateTime } from 'luxon'

const Button = styled(MuiButton)<ButtonProps>(() => ({
  backgroundColor: 'var(--mui-palette-common-white) !important',
  color: 'var(--mui-palette-primary-main) !important'
}))

const CustomerMembership = ({
  customerData,
  getCustomerData
}: {
  customerData: CustomerDetailsDataType
  getCustomerData: () => void
}) => {
  // Vars
  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: 'Upgrade To Premium'
  }

  const dialogProps = {
    getCustomerData,
    customerData
  }

  return (
    <Card>
      {customerData.membershipData ? (
        <CardContent className='flex flex-col gap-6'>
          <div className='flex justify-between'>
            <Chip label={customerData?.membershipData?.membershipName} size='small' color='primary' variant='tonal' />
            <div className='flex justify-center'>
              <Typography variant='h5' component='sup' className='self-start' color='primary'>
                ₹
              </Typography>
              <Typography component='span' variant='h1' color='primary'>
                {customerData?.membershipData?.amount}
              </Typography>
              {/* <Typography component='sub' className='self-end' color='text.primary'>
                {data?.SubscriptionData?.isYearly ? '/year' : '/month'}
              </Typography> */}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            {customerData?.membershipData?.startTime && customerData?.membershipData?.endTime ? (
              <div className='flex items-center gap-2'>
                <i className='ri-circle-fill text-[10px] text-textSecondary' />
                <Typography component='span'>{`Timing: ${DateTime.fromISO(customerData?.membershipData?.startTime).toFormat('hh:mm a')} - ${DateTime.fromISO(customerData?.membershipData?.endTime).toFormat('hh:mm a')}`}</Typography>
              </div>
            ) : (
              <></>
            )}

            {customerData?.membershipData?.startDay ? (
              <div className='flex items-center gap-2'>
                <i className='ri-circle-fill text-[10px] text-textSecondary' />
                <Typography component='span'>{`Start Day: ${DateTime.fromISO(customerData?.membershipData?.startDay).toFormat('dd LLL yyyy HH:mm:ss')}`}</Typography>
              </div>
            ) : (
              <></>
            )}

            {customerData?.membershipData?.endDay ? (
              <div className='flex items-center gap-2'>
                <i className='ri-circle-fill text-[10px] text-textSecondary' />
                <Typography component='span'>{`End Day: ${DateTime.fromISO(customerData?.membershipData?.endDay).toFormat('dd LLL yyyy HH:mm:ss')}`}</Typography>
              </div>
            ) : (
              <></>
            )}

            {customerData?.membershipData?.dailyLimit ? (
              <div className='flex items-center gap-2'>
                <i className='ri-circle-fill text-[10px] text-textSecondary' />
                <Typography component='span'>{`Daily Limit: ${customerData?.membershipData?.dailyLimit} minutes`}</Typography>
              </div>
            ) : (
              <></>
            )}

            {/* <div className='flex items-center gap-2'>
              <i className='ri-circle-fill text-[10px] text-textSecondary' />
              <Typography component='span'>Basic Support</Typography>
            </div> */}
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-between'>
              <Typography className='font-medium' color='text.primary'>
                Minutes
              </Typography>
              <Typography className='font-medium' color='text.primary'>
                {`${customerData?.membershipData?.balanceMinuteLeft ?? 0} of ${customerData?.membershipData?.balanceMinute} Minutes`}
              </Typography>
            </div>
            <LinearProgress
              variant='determinate'
              value={Math.round(
                ((customerData?.membershipData?.balanceMinuteLeft ?? 0) * 100) /
                  (customerData?.membershipData?.balanceMinute || 1)
              )}
            />
            <Typography variant='body2'>{`${customerData?.membershipData?.balanceMinuteLeft ?? 0} minutes remaining`}</Typography>
          </div>
        </CardContent>
      ) : (
        <CardContent className='flex flex-col gap-2 bg-primary'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-4'>
              <Typography variant='h5' color='common.white'>
                Upgrade to Premium
              </Typography>
              <Typography color='common.white'>Upgrade customer to premium to access pro features.</Typography>
            </div>
            <img src='/images/apps/ecommerce/3d-rocket.png' height={108} />
          </div>
          <OpenDialogOnElementClick
            element={Button}
            elementProps={buttonProps}
            dialog={UpgradeMembership}
            dialogProps={dialogProps}
          />
        </CardContent>
      )}
    </Card>
  )
}

export default CustomerMembership
