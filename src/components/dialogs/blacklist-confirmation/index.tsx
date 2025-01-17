'use client'

import { FormLabel } from '@mui/material'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'

type BlacklistConfirmationDataType = {
  reason: string
}

type BlacklistConfirmationInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  api: (reason: string) => void
}

const BlacklistConfirmation = ({ open, setOpen, api }: BlacklistConfirmationInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<BlacklistConfirmationDataType>({
    defaultValues: {
      reason: ''
    }
  })

  // useEffect(() => {
  //   resetForm(customerData)
  // }, [customerData, resetForm])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: BlacklistConfirmationDataType) => {
    api(data.reason)
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='xs' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:items-start pb-0'>
        <div className='text-center sm:text-start'>Blacklist Customer</div>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible flex justify-center sm:justify-start'>
          {/* <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton> */}
          <div className='flex sm:flex-row flex-col gap-2 sm:w-full justify-center sm:justify-start'>
            <div className='flex flex-col justify-start w-full'>
              <FormLabel className='font-bold'>Reason</FormLabel>
              <Controller
                name='reason'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size='medium'
                    value={value}
                    onChange={onChange}
                    {...(errors.reason && {
                      error: true,
                      helperText: errors.reason?.message || 'Please provide a reason'
                    })}
                  />
                )}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className='justify-center sm:justify-end'>
          <Button size='small' variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
          <Button size='small' variant='contained' type='submit'>
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BlacklistConfirmation
