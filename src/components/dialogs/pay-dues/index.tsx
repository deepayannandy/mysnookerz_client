'use client'

import { CustomerDetailsDataType } from '@/types/staffTypes'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
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

type PayDueDataType = {
  amount: number | string
  paymentMethod: string
}

type PayDueInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  customerData: CustomerDetailsDataType
  getCustomerData: () => void
}

const paymentMethods = ['CASH', 'UPI', 'CARD']

const PayDue = ({ open, setOpen, getCustomerData, customerData }: PayDueInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<PayDueDataType>({
    defaultValues: {
      amount: '',
      paymentMethod: paymentMethods[0]
    }
  })

  // useEffect(() => {
  //   resetForm(customerData)
  // }, [customerData, resetForm])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: PayDueDataType) => {
    const credit = (customerData?.customers?.credit ?? 0) - (Number(data.amount) ? Number(data.amount) : 0)
    if (credit < 0) {
      toast.error('Amount cannot be more than due')
      return
    }

    const description = 'Pay Dues'
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/customer/${customerData?.customers?._id}`,
        { credit, paymentMethods: data.paymentMethod, description },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getCustomerData()
        resetForm()
        setOpen(false)
        toast.success('Dues paid successfully')
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
        <div className='max-sm:is-[80%] max-sm:text-center'>Pay Dues</div>
        <Typography component='span' className='flex flex-col text-center'>
          {`Payment Due: ₹${customerData?.customers?.credit ?? 0}`}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex justify-center'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <div className='flex sm:flex-row flex-col justify-between gap-4'>
            <Controller
              name='amount'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  fullWidth
                  label='Amount'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={onChange}
                  {...(errors.amount && {
                    error: true,
                    helperText: errors.amount?.message || 'This field is required'
                  })}
                />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Controller
                name='paymentMethod'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select size='small' label='Payment Method' {...field}>
                    {paymentMethods.map((method, index) => (
                      <MenuItem key={index} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.paymentMethod && <FormHelperText error>This field is required.</FormHelperText>}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PayDue
