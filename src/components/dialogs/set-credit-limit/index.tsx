'use client'

import { CustomerDetailsDataType } from '@/types/staffTypes'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type SetCreditLimitDataType = {
  maxCredit: number | string
}

type SetCreditLimitInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  customerData: CustomerDetailsDataType
  getCustomerData: () => void
}

const SetCreditLimit = ({ open, setOpen, getCustomerData, customerData }: SetCreditLimitInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<SetCreditLimitDataType>({
    defaultValues: {
      maxCredit: ''
    }
  })

  // useEffect(() => {
  //   resetForm(customerData)
  // }, [customerData, resetForm])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: SetCreditLimitDataType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(`${apiBaseUrl}/customer/${customerData?.customers?._id}`, data, {
        headers: { 'auth-token': token }
      })

      if (response && response.data) {
        getCustomerData()
        resetForm()
        setOpen(false)
        toast.success('Credit info updated successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='xs' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Credit Limit</div>
        <Typography component='span' className='flex flex-col text-center'>
          {`Current Limit: ₹${customerData?.customers?.maxCredit}`}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex justify-center'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <div className='flex flex-col max-w-fit justify-center'>
            <Controller
              name='maxCredit'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  fullWidth
                  label='New Credit Limit'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={onChange}
                  {...(errors.maxCredit && {
                    error: true,
                    helperText: errors.maxCredit?.message || 'This field is required'
                  })}
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default SetCreditLimit
