'use client'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { CategoryListType } from '@/types/adminTypes'
// MUI Imports
import { Autocomplete } from '@mui/material'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type NewExpenseDataType = {
  date: Date
  category: CategoryListType | string
  invoiceNumber: string
  vendorName: string
  description: string
  amount: string | number
  quantity: string | number
  note: string
  paid: string | number
}

type NewExpenseProps = {
  open: boolean
  setOpen: (open: boolean) => void
  getAllExpenseData: () => void
}

const NewExpense = ({ open, setOpen, getAllExpenseData }: NewExpenseProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()
  const [categoryList, setCategoryList] = useState([] as CategoryListType[])

  const {
    control,
    reset: resetForm,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<NewExpenseDataType>({
    // resolver: yupResolver(schema),
    defaultValues: {
      date: new Date(),
      category: '',
      invoiceNumber: '',
      vendorName: '',
      description: '',
      amount: '',
      quantity: '',
      note: '',
      paid: ''
    }
  })

  const total = Number(watch('amount') ?? 0) * Number(watch('quantity') ?? 0)

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const getAllCategoryData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/category/expanse`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        const data = response.data.map((category: { _id: string; name: string }) => {
          return {
            categoryId: category._id,
            name: category.name
          }
        })

        setCategoryList(data)
      }
    } catch (error: any) {
      // if (error?.response?.status === 401) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getAllCategoryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: NewExpenseDataType) => {
    if (Number(data.paid ?? 0) > total) {
      toast.error('Paid amount cannot be more than total amount', { hideProgressBar: false })
      return
    }

    let category = {}
    if (typeof data.category === 'string') {
      category = { name: data.category }
    } else {
      category = data.category
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/expanse`,
        { ...data, category },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        getAllExpenseData()
        resetForm()
        setOpen(false)
        toast.success('Expense added successfully')
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
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>New Expense</Typography>
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
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
                  options={categoryList}
                  getOptionLabel={option => ((option as CategoryListType).name ?? option)?.split('(').join(' (')}
                  freeSolo
                  value={value}
                  onChange={(_, value) => onChange(value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Category'
                      {...(errors.category && {
                        error: true,
                        helperText: errors.category.message || 'This field is required'
                      })}
                    />
                  )}
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
                    fullWidth
                    label='Invoice Number'
                    value={value}
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
                    fullWidth
                    label='Vendor Name'
                    value={value}
                    onChange={onChange}
                    {...(errors.vendorName && {
                      error: true,
                      helperText: errors.vendorName.message || 'This field is required'
                    })}
                  />
                )}
              />
            </div>

            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  multiline
                  label='Description'
                  value={value}
                  onChange={onChange}
                  {...(errors.description && {
                    error: true,
                    helperText: errors.description.message || 'This field is required'
                  })}
                />
              )}
            />

            <div className='flex flex-col sm:flex-row items-start gap-3'>
              <Controller
                name='amount'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Amount'
                    inputProps={{ type: 'number', min: 0 }}
                    value={value}
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
                    fullWidth
                    label='Quantity'
                    value={value}
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
              <p>{`₹${total.toFixed(2)}`}</p>
            </div>

            <Controller
              name='note'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  multiline
                  label='Note'
                  value={value}
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
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
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

export default NewExpense
