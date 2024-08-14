'use client'

// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'

type DeleteConfirmationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  deleteApiCall: () => void
}

const DeleteConfirmation = ({ open, setOpen, name, deleteApiCall }: DeleteConfirmationProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='xs' scroll='body'>
      <DialogTitle
        id='alert-dialog-title'
        className='flex gap-2 flex-col items-center'
      >{`Are you sure you want to delete this ${name}?`}</DialogTitle>
      {/* <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no
          apps are running.
        </DialogContentText>
      </DialogContent> */}
      <DialogActions className='justify-center'>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' color='error' onClick={deleteApiCall} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmation
