// MUI Imports
//import UpgradePlan from '@/components/dialogs/upgrade-plan'
import { UserDataType } from '@/types/adminTypes'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { DateTime } from 'luxon'

// Component Imports

const UserPlan = ({ data }: { data: UserDataType }) => {
  //Vars
  // const buttonProps: ButtonProps = {
  //   variant: 'contained',
  //   children: 'Upgrade Plan'
  // }

  const daysPast =
    typeof data?.SubscriptionData === 'object' && data?.SubscriptionData?.startDate
      ? Math.round(DateTime.now().diff(DateTime.fromISO(data.SubscriptionData?.startDate), 'days').days)
      : 0

  return (
    <>
      <Card className='border-2 border-primary rounded'>
        {typeof data.SubscriptionData !== 'object' ? (
          <CardContent className='flex flex-col gap-6'>
            <Typography className='font-medium' color='text.primary'>
              No active subscription
            </Typography>
          </CardContent>
        ) : (
          <CardContent className='flex flex-col gap-6'>
            <div className='flex justify-between'>
              <Chip label={data?.SubscriptionData?.subscriptionName} size='small' color='primary' variant='tonal' />
              <div className='flex justify-center'>
                <Typography variant='h5' component='sup' className='self-start' color='primary'>
                  ₹
                </Typography>
                <Typography component='span' variant='h5' color='primary'>
                  {data?.SubscriptionData?.subscriptionAmount}
                </Typography>
                <Typography component='sub' className='self-end' color='text.primary'>
                  /month
                </Typography>
              </div>
            </div>
            {/* <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <i className='ri-circle-fill text-[10px] text-textSecondary' />
              <Typography component='span'>10 Users</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <i className='ri-circle-fill text-[10px] text-textSecondary' />
              <Typography component='span'>Up to 10 GB storage</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <i className='ri-circle-fill text-[10px] text-textSecondary' />
              <Typography component='span'>Basic Support</Typography>
            </div>
          </div> */}
            <div className='flex flex-col gap-1'>
              <div className='flex items-center justify-between'>
                <Typography className='font-medium' color='text.primary'>
                  Days
                </Typography>
                <Typography className='font-medium' color='text.primary'>
                  {`${daysPast} of ${data?.SubscriptionData?.subscriptionValidity} Days`}
                </Typography>
              </div>
              <LinearProgress
                variant='determinate'
                value={Math.round((daysPast * 100) / (data?.SubscriptionData?.subscriptionValidity || 1))}
              />
              <Typography variant='body2'>{`${(data?.SubscriptionData?.subscriptionValidity || 0) - daysPast} days remaining`}</Typography>
            </div>
            {/* <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={UpgradePlan} /> */}
          </CardContent>
        )}
      </Card>
    </>
  )
}

export default UserPlan