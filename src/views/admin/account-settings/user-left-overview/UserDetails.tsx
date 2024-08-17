// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Type Imports

// Component Imports
import { UserDataType } from '@/types/adminTypes'
import CustomAvatar from '@core/components/mui/Avatar'

// Vars
// const userData = {
//   firstName: 'Seth',
//   lastName: 'Hallam',
//   storeName: 'Atbv store',
//   email: 'shallamb@gmail.com',
//   contact: '6298477372',
//   address: 'Mumbai, Maharastra, India',
//   useAsBillingAddress: true
// }

const UserDetails = ({ data }: { data: UserDataType }) => {
  // const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  //   children,
  //   color,
  //   variant
  // })

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar alt='user-profile' src='/images/avatars/1.png' variant='rounded' size={120} />
                <Typography variant='h5'>{data?.clientName}</Typography>
              </div>
              {/* <Chip label='Subscriber' color='error' size='small' variant='tonal' /> */}
            </div>
            <div className='flex items-center justify-around flex-wrap gap-4'>
              {/* <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-check-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>1.23k</Typography>
                  <Typography>Task Done</Typography>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-star-smile-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>568</Typography>
                  <Typography>Project Done</Typography>
                </div> */}
              {/* </div> */}
            </div>
          </div>
          <div>
            <Typography variant='h5'>Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Store Name:
                </Typography>
                <Typography>{data?.StoreData?.storeName}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography>{data?.StoreData?.email}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Contact:
                </Typography>
                <Typography color='text.primary'>{data?.StoreData?.contact}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1'>
                <Typography className='font-medium' color='text.primary'>
                  Address:
                </Typography>
                <Typography color='text.primary'>{data?.StoreData?.address}</Typography>
              </div>
            </div>
          </div>
          {/* <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: userData }}
            />
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'outlined')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            />
          </div> */}
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
