'use client'

import { getPlanAccessControl } from '@/utils/Utils'
import HistoryTable from '@/views/staff/game-history/HistoryTable'
import { Typography } from '@mui/material'

const HistoryPage = () => {
  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.gameHistory ? (
        <HistoryTable />
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default HistoryPage
