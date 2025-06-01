'use client'

import { getPlanAccessControl } from '@/utils/Utils'
import CustomerListTable from '@/views/staff/customer/CustomerListTable'
import { Typography } from '@mui/material'

const CustomerListPage = () => {
  const planAccessControl = getPlanAccessControl()
  return (
    <>
      {planAccessControl.customerListing ? (
        <CustomerListTable />
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default CustomerListPage
