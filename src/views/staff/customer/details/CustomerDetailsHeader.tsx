// MUI Imports
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import MenuDropdown from './MenuDropdown'

const CustomerDetailHeader = ({
  customerId,
  boardingDate,
  setCreditLimitDialogOpen,
  setOldCreditDialogOpen,
  setDeleteConfirmationDialogOpen
}: {
  customerId: string
  boardingDate: string
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

  return (
    <div className='flex flex-wrap justify-between items-center gap-x-6 gap-y-4'>
      <div className='flex flex-col gap-1'>
        <Typography variant='h4'>{`Customer ID #${'ewewqe'}`}</Typography>
        <Typography>{boardingDate}</Typography>
      </div>
      <div className='flex flex-col sm:flex-row justify-between gap-3'>
        <OpenDialogOnElementClick
          element={Button}
          elementProps={buttonProps('Pay Dues', 'error', 'outlined')}
          dialog={ConfirmationDialog}
          dialogProps={{ type: 'pay-dues' }}
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
