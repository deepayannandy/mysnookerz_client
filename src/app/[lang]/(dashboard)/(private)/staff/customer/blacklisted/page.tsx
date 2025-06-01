'use client'

import { getPlanAccessControl } from '@/utils/Utils'
import BlacklistedCustomerListTable from '@/views/staff/customer/BlacklistedCustomerListTable'
import { Typography } from '@mui/material'

const BlacklistedCustomerListPage = () => {
  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.cafeManagement ? (
        <BlacklistedCustomerListTable />
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default BlacklistedCustomerListPage
