'use client'

import { ChangePasswordDataType } from '@/views/admin/account-settings/user-right/security/ChangePassword'
import { DialogContent } from '@mui/material'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'

type ChangePasswordConfirmationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data: ChangePasswordDataType
  submitApiCall: (data: ChangePasswordDataType) => void
}

const ChangePasswordConfirmation = ({ open, setOpen, data, submitApiCall }: ChangePasswordConfirmationProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='sm' scroll='body'>
      {/* <DialogTitle
        id='alert-dialog-title'
        className='flex gap-2 flex-col items-center'
      >{`If you change the password, you will need to re-login.
Do you still wish to change the password?`}</DialogTitle> */}
      <DialogContent className='flex flex-col gap-3'>
        <span className='text-xl'>If you change the password, you will need to re-login.</span>
        <span className='text-xl font-bold'>Do you still wish to change the password?</span>
      </DialogContent>
      <DialogActions className='justify-end'>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' color='error' onClick={() => submitApiCall(data)} autoFocus>
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordConfirmation
