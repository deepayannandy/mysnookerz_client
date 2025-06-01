'use client'

import { getPlanAccessControl } from '@/utils/Utils'
import NewProduct from '@/views/admin/product/NewProduct'
import { Typography } from '@mui/material'

const NewProductPage = () => {
  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.cafeManagement ? (
        <NewProduct />
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default NewProductPage
