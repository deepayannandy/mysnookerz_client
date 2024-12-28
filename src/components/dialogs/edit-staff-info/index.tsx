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
import _ from 'lodash'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type EditStaffDataType = {
  _id: string
  fullName: string
  mobile: string | null
  email: string
  profileImage?: string
  password?: string | null
  confirmPassword?: string
}

type EditStaffInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  staffData: EditStaffDataType
  getStaffData: () => void
}

const schema: yup.ObjectSchema<Omit<EditStaffDataType, '_id'>> = yup.object().shape({
  fullName: yup.string().required('This field is required').min(1),
  mobile: yup.string().required('This field is required').min(10).max(10),
  email: yup.string().required('This field is required').email('Please enter a valid email address'),
  profileImage: yup.string(),
  password: yup
    .string()
    .transform((value, originalValue) => (originalValue.trim() === '' ? null : value))
    .min(8, 'Password must be at least 8 characters long')
    .notRequired()
    .nullable(),
  confirmPassword: yup
    .string()
    .when(['password'], {
      is: (password: string) => !!password,
      then: schema => schema.required('This field is required')
    })
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
})

const EditStaffInfo = ({ open, setOpen, getStaffData, staffData }: EditStaffInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<Omit<EditStaffDataType, '_id'>>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      profileImage: '',
      password: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    resetForm({ ..._.omit(staffData, 'password'), password: '', confirmPassword: '' })
  }, [staffData, resetForm])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: Omit<EditStaffDataType, '_id'>) => {
    // const storeId = localStorage.getItem('storeId')
    const profileImage = '-'
    const userDesignation = 'Staff'
    const requestData = _.omit(data, 'confirmPassword')
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/user/${staffData._id}`,
        { ...requestData, userDesignation, profileImage },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        getStaffData()
        resetForm()
        setOpen(false)
        toast.success('Staff info updated successfully')
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
        <Typography variant='h5'>Edit Staff Info</Typography>
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
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.fullName && { error: true, helperText: errors.fullName.message })}
                />
              )}
            />

            <Controller
              name='mobile'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Mobile'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.mobile && { error: true, helperText: errors.mobile.message })}
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Email'
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.email && { error: true, helperText: errors.email.message })}
                />
              )}
            />

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
                  {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword?.message })}
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

  // return (
  //   <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
  //     <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
  //       <div className='max-sm:is-[80%] max-sm:text-center'>Edit Staff Info</div>
  //       {/* <Typography component='span' className='flex flex-col text-center'>
  //         Updating user details will receive a privacy audit.
  //       </Typography> */}
  //     </DialogTitle>
  //     <form onSubmit={handleSubmit(data => onSubmit(data))}>
  //       <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
  //         <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
  //           <i className='ri-close-line text-textSecondary' />
  //         </IconButton>
  //         <Grid container spacing={5}>
  //           <Grid item xs={12} sm={6}>
  //             <Controller
  //               name='fullName'
  //               control={control}
  //               rules={{ required: true }}
  //               render={({ field: { value, onChange } }) => (
  //                 <TextField
  //                   fullWidth
  //                   label='Full Name'
  //                   value={value}
  //                   onChange={onChange}
  //                   {...(errors.fullName && { error: true, helperText: errors.fullName.message })}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <Controller
  //               name='mobile'
  //               control={control}
  //               rules={{ required: true }}
  //               render={({ field: { value, onChange } }) => (
  //                 <TextField
  //                   fullWidth
  //                   label='Mobile'
  //                   inputProps={{ type: 'number', min: 0 }}
  //                   value={value}
  //                   onChange={onChange}
  //                   {...(errors.mobile && { error: true, helperText: errors.mobile.message })}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <Controller
  //               name='email'
  //               control={control}
  //               rules={{ required: true }}
  //               render={({ field: { value, onChange } }) => (
  //                 <TextField
  //                   fullWidth
  //                   label='Email'
  //                   value={value}
  //                   onChange={onChange}
  //                   {...(errors.email && { error: true, helperText: errors.email.message })}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <Controller
  //               name='password'
  //               control={control}
  //               rules={{ required: true }}
  //               render={({ field: { value, onChange } }) => (
  //                 <TextField
  //                   fullWidth
  //                   label='Password'
  //                   value={value}
  //                   onChange={onChange}
  //                   {...(errors.password && { error: true, helperText: errors.password.message })}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <Controller
  //               name='confirmPassword'
  //               control={control}
  //               rules={{ required: true }}
  //               render={({ field: { value, onChange } }) => (
  //                 <TextField
  //                   fullWidth
  //                   label='Confirm Password'
  //                   value={value}
  //                   onChange={onChange}
  //                   {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword?.message })}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           {/* <Grid item xs={12} sm={6}>
  //             <TextField
  //               fullWidth
  //               label='Email'
  //               placeholder='JohnDoe'
  //               value={userData?.email}
  //               onChange={e => setUserData({ ...userData, email: e.target.value })}
  //             />
  //           </Grid> */}
  //         </Grid>
  //       </DialogContent>
  //       <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
  //         <Button variant='contained' type='submit'>
  //           Submit
  //         </Button>
  //         <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
  //           Cancel
  //         </Button>
  //       </DialogActions>
  //     </form>
  //   </Dialog>
  // )
}

export default EditStaffInfo
