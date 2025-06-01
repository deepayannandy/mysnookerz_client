'use client'

import { getPlanAccessControl } from '@/utils/Utils'
import FoodOrderHistoryTable from '@/views/staff/cafe-history/FoodOrderHistoryTable'
import { Typography } from '@mui/material'

const FoodOrderHistoryPage = () => {
  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.cafeHistory ? (
        <FoodOrderHistoryTable />
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default FoodOrderHistoryPage
