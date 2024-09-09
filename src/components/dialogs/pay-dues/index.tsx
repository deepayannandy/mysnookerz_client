'use client'

import { FormControl, FormHelperText, FormLabel, MenuItem } from '@mui/material'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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
  customerData: {
    customerId: string
    credit: number
  }
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
    const credit = (customerData?.credit ?? 0) - (Number(data.amount) ? Number(data.amount) : 0)
    if (credit < 0) {
      toast.error('Amount cannot be more than due')
      return
    }

    const description = 'Pay Dues'
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/customer/${customerData?.customerId}`,
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
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:items-start pb-0'>
        <div className='text-center sm:text-start'>Pay Dues</div>
        <Typography component='span' className='flex flex-col text-center'>
          {`Payment Due: ₹${customerData?.credit ?? 0}`}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible flex justify-center sm:justify-start'>
          {/* <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton> */}
          <div className='flex sm:flex-row flex-col gap-2 sm:w-full justify-center sm:justify-start'>
            <div className='flex flex-col justify-start w-full'>
              <FormLabel className='font-bold'>Amount</FormLabel>
              <Controller
                name='amount'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size='small'
                    inputProps={{ type: 'number', min: 0, step: 'any' }}
                    value={value}
                    onChange={onChange}
                    {...(errors.amount && {
                      error: true,
                      helperText: errors.amount?.message || 'This field is required'
                    })}
                  />
                )}
              />
            </div>

            <div className='flex flex-col justify-start w-full'>
              <FormLabel className='font-bold'>Payment Method</FormLabel>
              <FormControl>
                <Controller
                  name='paymentMethod'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField select size='small' {...field}>
                      {paymentMethods.map((method, index) => (
                        <MenuItem key={index} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                {errors.paymentMethod && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </div>
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

export default PayDue
