// MUI Imports
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Type Imports

// Component Imports
import EditCustomerInfo from '@/components/dialogs/edit-customer-info'
import { CustomerDetailsDataType } from '@/types/staffTypes'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import { DateTime } from 'luxon'

const CustomerDetails = ({
  customerData,
  getCustomerData
}: {
  customerData: CustomerDetailsDataType
  getCustomerData: () => void
}) => {
  // Vars
  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: 'Edit Details'
  }

  const dialogProps = {
    customerData: customerData?.customers,
    getCustomerData
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar
              src={customerData?.customers?.profileImage}
              variant='rounded'
              alt='Customer Avatar'
              size={120}
            />
            <div className='flex flex-col items-center'>
              <Typography variant='h5'>{customerData?.customers?.fullName}</Typography>
              <Chip label={customerData?.customers?.status ?? 'Active'} variant='tonal' color='success' size='small' />
              {/* <Typography>Customer ID #{customerData?.customerId}</Typography> */}
            </div>
          </div>
          <div className='flex items-center justify-center gap-x-12 gap-y-3 flex-wrap'>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='ri-shopping-cart-2-line' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{customerData?.orders}</Typography>
                <Typography>Orders</Typography>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='ri-money-rupee-circle-line' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>₹{customerData?.totalSpend}</Typography>
                <Typography>Spent</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>Details</Typography>
          <Divider />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Contact:
              </Typography>
              <Typography>{customerData?.customers?.contact}</Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Email:
              </Typography>
              <Typography>{customerData?.customers?.email}</Typography>
            </div>
            {/* <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Status:
              </Typography>
              <Chip label='Active' variant='tonal' color='success' size='small' />
            </div> */}
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Date of Birth:
              </Typography>
              <Typography>
                {customerData?.customers?.dob
                  ? DateTime.fromISO(customerData.customers.dob).toFormat('dd LLL yyyyy')
                  : ''}
              </Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                City:
              </Typography>
              <Typography>{customerData?.customers?.city}</Typography>
            </div>
          </div>
        </div>
        <OpenDialogOnElementClick
          element={Button}
          elementProps={buttonProps}
          dialog={EditCustomerInfo}
          dialogProps={dialogProps}
        />
      </CardContent>
    </Card>
  )
}

export default CustomerDetails
