'use client'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { ExpenseDataType } from '@/types/adminTypes'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type EditExpenseDataType = {
  date: Date
  category: string
  invoiceNumber: string
  vendorName: string
  name: string
  amount: string | number
  quantity: string | number
  note: string
  paid: string | number
}

type EditExpenseInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  expenseData: ExpenseDataType
  getAllExpenseData: () => void
}

const EditExpenseInfo = ({ open, setOpen, getAllExpenseData, expenseData }: EditExpenseInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<EditExpenseDataType>({
    // resolver: yupResolver(schema),
    defaultValues: {
      paid: ''
    }
  })

  useEffect(() => {
    resetForm({
      date: expenseData.date ? new Date(expenseData.date) : new Date(),
      category: expenseData.category?.name ?? '',
      invoiceNumber: expenseData.invoiceNumber,
      vendorName: expenseData.vendorName,
      name: expenseData.name,
      amount: expenseData.amount,
      quantity: expenseData.quantity,
      note: expenseData.note,
      paid: expenseData.invoiceAmount - expenseData.paid
    })
  }, [expenseData, resetForm])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: EditExpenseDataType) => {
    if (Number(data.paid ?? 0) > Number(expenseData.invoiceAmount ?? 0)) {
      toast.error('Paid amount cannot be more than total amount', { hideProgressBar: false })
      return
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const expenseId = expenseData._id
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/expense/${expenseId}`,
        { paid: data.paid },
        { headers: { 'auth-token': token } }
      )
      if (response && response.data) {
        getAllExpenseData()
        resetForm()
        setOpen(false)
        toast.success('Expense info updated successfully')
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
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Edit Expense</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            <Controller
              name='date'
              control={control}
              render={({ field: { value, onChange } }) => (
                <AppReactDatepicker
                  disabled
                  selected={value}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={40}
                  onChange={onChange}
                  placeholderText='DD/MM/YYYY'
                  dateFormat={'dd/MM/yyyy'}
                  customInput={
                    <TextField
                      value={value}
                      onChange={onChange}
                      fullWidth
                      label='Date'
                      {...(errors.date && { error: true, helperText: errors.date.message || 'This field is required' })}
                    />
                  }
                />
              )}
            />

            <Controller
              name='category'
              control={control}
              rules={{ required: true }}
              render={({ field: { value } }) => (
                <TextField
                  disabled
                  value={value ?? ''}
                  variant='outlined'
                  label='Category'
                  {...(errors.category && {
                    error: true,
                    helperText: errors.category.message || 'This field is required'
                  })}
                />
              )}
            />
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled
                  fullWidth
                  multiline
                  label='Name'
                  value={value ?? ''}
                  onChange={onChange}
                  {...(errors.name && {
                    error: true,
                    helperText: errors.name.message || 'This field is required'
                  })}
                />
              )}
            />

            <div className='flex flex-col sm:flex-row items-start gap-3'>
              <Controller
                name='invoiceNumber'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    disabled
                    fullWidth
                    label='Invoice Number'
                    value={value ?? ''}
                    onChange={onChange}
                    {...(errors.invoiceNumber && {
                      error: true,
                      helperText: errors.invoiceNumber.message || 'This field is required'
                    })}
                  />
                )}
              />

              <Controller
                name='vendorName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    disabled
                    fullWidth
                    label='Vendor Name'
                    value={value ?? ''}
                    onChange={onChange}
                    {...(errors.vendorName && {
                      error: true,
                      helperText: errors.vendorName.message || 'This field is required'
                    })}
                  />
                )}
              />
            </div>

            <div className='flex flex-col sm:flex-row items-start gap-3'>
              <Controller
                name='amount'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    disabled
                    fullWidth
                    label='Amount'
                    inputProps={{ type: 'number', min: 0 }}
                    value={value ?? ''}
                    onChange={onChange}
                    {...(errors.amount && {
                      error: true,
                      helperText: errors.amount.message || 'This field is required'
                    })}
                  />
                )}
              />

              <Controller
                name='quantity'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    disabled
                    fullWidth
                    label='Quantity'
                    value={value ?? ''}
                    inputProps={{ type: 'number', min: 0 }}
                    onChange={onChange}
                    {...(errors.quantity && {
                      error: true,
                      helperText: errors.quantity.message || 'This field is required'
                    })}
                  />
                )}
              />
            </div>

            <div className='w-full grid grid-cols-2 gap-2 p-4 mt-2 border rounded-lg'>
              <p>Total</p>
              <p>{`₹${expenseData.invoiceAmount ? expenseData.invoiceAmount.toFixed(2) : 0}`}</p>
            </div>

            <Controller
              name='note'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled
                  fullWidth
                  multiline
                  label='Note'
                  value={value ?? ''}
                  onChange={onChange}
                  {...(errors.note && { error: true, helperText: errors.note.message || 'This field is required' })}
                />
              )}
            />

            <Controller
              name='paid'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Paid'
                  inputProps={{ type: 'number', min: 0, max: expenseData.invoiceAmount - expenseData.paid }}
                  value={value ?? ''}
                  onChange={onChange}
                  {...(errors.paid && { error: true, helperText: errors.paid.message || 'This field is required' })}
                />
              )}
            />

            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default EditExpenseInfo
