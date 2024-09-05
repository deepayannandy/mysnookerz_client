// MUI Imports
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import PayDue from '@/components/dialogs/pay-dues'
import { CustomerDetailsDataType } from '@/types/staffTypes'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import { DateTime } from 'luxon'
import MenuDropdown from './MenuDropdown'

const CustomerDetailHeader = ({
  boardingDate,
  customerData,
  getCustomerData,
  setCreditLimitDialogOpen,
  setOldCreditDialogOpen,
  setDeleteConfirmationDialogOpen
}: {
  boardingDate: string
  customerData: CustomerDetailsDataType
  getCustomerData: () => void
  setCreditLimitDialogOpen: (value: boolean) => void
  setOldCreditDialogOpen: (value: boolean) => void
  setDeleteConfirmationDialogOpen: (value: boolean) => void
}) => {
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  const dialogProps = {
    customerData,
    getCustomerData
  }

  return (
    <div className='flex flex-wrap justify-between items-center gap-x-6 gap-y-4'>
      <div className='flex flex-col gap-1'>
        {/* <Typography variant='h4'>{`Customer ID #${'ewewqe'}`}</Typography> */}
        <Typography>{`${boardingDate ? DateTime.fromISO(boardingDate).toFormat('dd LLL yyyy') : ''}`}</Typography>
      </div>
      <div className='flex flex-col sm:flex-row justify-between gap-3'>
        <OpenDialogOnElementClick
          element={Button}
          elementProps={buttonProps('Pay Dues', 'error', 'outlined')}
          dialog={PayDue}
          dialogProps={dialogProps}
        />
        {/* <OpenDialogOnElementClick
          element={Button}
          elementProps={buttonProps('Menu', 'error', 'outlined')}
          dialog={ConfirmationDialog}
          dialogProps={{ type: 'menu' }}
        /> */}
        <MenuDropdown
          setCreditLimitDialogOpen={setCreditLimitDialogOpen}
          setOldCreditDialogOpen={setOldCreditDialogOpen}
          setDeleteConfirmationDialogOpen={setDeleteConfirmationDialogOpen}
        />
      </div>
    </div>
  )
}

export default CustomerDetailHeader
