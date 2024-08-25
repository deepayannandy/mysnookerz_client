'use client'

// React Imports

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type NewCustomerRegistrationDataType = {
  fullName: string
  contact: string | null
  email?: string | null
  profileImage?: string
}

type NewCustomerRegistrationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  getCustomerData: () => void
}

const schema: yup.ObjectSchema<NewCustomerRegistrationDataType> = yup.object().shape({
  fullName: yup.string().required('This field is required').min(1),
  contact: yup.string().required('This field is required').min(10).max(10),
  email: yup
    .string()
    .notRequired()
    .nullable()
    .transform((value, originalValue) => (originalValue.trim() === '' ? null : value))
    .email('Please enter a valid email address'),
  profileImage: yup.string()
})

const NewCustomerRegistration = ({ open, setOpen, getCustomerData }: NewCustomerRegistrationProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<NewCustomerRegistrationDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      contact: '',
      email: ''
    }
  })

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: NewCustomerRegistrationDataType) => {
    const storeId = localStorage.getItem('storeId')
    const profileImage = '-'
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/customer`,
        { ...data, profileImage, storeId },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        getCustomerData()
        resetForm()
        setOpen(false)
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
        <Typography variant='h5'>New Customer Registration</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            <Controller
              name='fullName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Full Name'
                  value={value}
                  onChange={onChange}
                  {...(errors.fullName && { error: true, helperText: errors.fullName.message })}
                />
              )}
            />

            <Controller
              name='contact'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Contact'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={onChange}
                  {...(errors.contact && { error: true, helperText: errors.contact.message })}
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Email'
                  value={value}
                  onChange={onChange}
                  {...(errors.email && { error: true, helperText: errors.email.message })}
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

export default NewCustomerRegistration
