'use client'

import { CustomerDetailsDataType } from '@/types/staffTypes'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormLabel from '@mui/material/FormLabel'
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
      const response = await axios.patch(
        `${apiBaseUrl}/customer/${customerData?.customers?._id}`,
        { maxCredit: -data.maxCredit },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getCustomerData()
        resetForm()
        setOpen(false)
        toast.success('Credit info updated successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='xs' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:items-start pb-0'>
        <div className='text-center sm:text-start'>Credit Limit</div>
        <Typography component='span' className='flex flex-col text-center'>
          {`Current Limit: ₹${Math.abs(customerData?.customers?.maxCredit ?? 0)}`}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible flex justify-center sm:justify-start'>
          {/* <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton> */}
          <div className='flex flex-col gap-2 sm:w-full justify-center sm:justify-start'>
            <FormLabel className='font-bold'>Amount</FormLabel>
            <Controller
              name='maxCredit'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  fullWidth
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
        <DialogActions className='justify-center sm:justify-end'>
          <Button size='small' variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
          <Button size='small' variant='contained' type='submit'>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default SetCreditLimit
