'use client'

import { getPlanAccessControl } from '@/utils/Utils'
import ExpenseListTable from '@/views/staff/expense/ExpenseListTable'
import { Typography } from '@mui/material'

const ExpensePage = () => {
  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.expense ? (
        <ExpenseListTable />
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default ExpensePage
