'use client'

import { getPlanAccessControl } from '@/utils/Utils'
import ProductListTable from '@/views/admin/product/ProductListTable'
import { Typography } from '@mui/material'

const ProductListPage = () => {
  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.cafeManagement ? (
        <ProductListTable />
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default ProductListPage
