'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type NewStaffRegistrationDataType = {
  fullName: string
  mobile: string | null
  email: string
  profileImage?: string
  password: string
  confirmPassword: string
}

type NewStaffRegistrationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: NewStaffRegistrationDataType
  getStaffData: () => void
}

const schema: yup.ObjectSchema<NewStaffRegistrationDataType> = yup.object().shape({
  fullName: yup.string().required('This field is required').min(1),
  mobile: yup.string().required('This field is required').min(10).max(10),
  email: yup.string().required('This field is required').email('Please enter a valid email address'),
  profileImage: yup.string(),
  password: yup.string().required('This field is required').min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .required('This field is required')
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
})

const NewStaffRegistration = ({ open, setOpen, getStaffData, data }: NewStaffRegistrationProps) => {
  // States
  const [userData, setUserData] = useState<NewStaffRegistrationProps['data']>(data)

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<NewStaffRegistrationDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      mobile: null,
      email: '',
      profileImage: '',
      password: ''
    }
  })

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: NewStaffRegistrationDataType) => {
    data.profileImage = '-'
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(`${apiBaseUrl}/user/register`, data, { headers: { 'auth-token': token } })

      if (response && response.data) {
        getStaffData()
        resetForm()
        setOpen(false)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>New Staff Registration</div>
        {/* <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography> */}
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='mobile'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Mobile'
                    inputProps={{ type: 'number', min: 0 }}
                    value={value}
                    onChange={onChange}
                    {...(errors.mobile && { error: true, helperText: errors.mobile.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Password'
                    value={value}
                    onChange={onChange}
                    {...(errors.password && { error: true, helperText: errors.password.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='confirmPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Confirm Password'
                    value={value}
                    onChange={onChange}
                    {...(errors.password && { error: true, helperText: errors.confirmPassword?.message })}
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Email'
                placeholder='JohnDoe'
                value={userData?.email}
                onChange={e => setUserData({ ...userData, email: e.target.value })}
              />
            </Grid> */}
          </Grid>
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

export default NewStaffRegistration
