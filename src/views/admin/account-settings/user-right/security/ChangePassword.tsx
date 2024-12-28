'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import ChangePasswordConfirmation from '@/components/dialogs/change-password-confirmation'
import { Locale } from '@/configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export type ChangePasswordDataType = {
  password: string
  confirmPassword: string
}

const schema: yup.ObjectSchema<ChangePasswordDataType> = yup.object().shape({
  password: yup.string().required('This field is required').min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .required('This field is required')
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
})

const ChangePassword = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [changePasswordConfirmationDialogOpen, setChangePasswordConfirmationDialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  })

  const { lang: locale } = useParams()
  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = (data: ChangePasswordDataType) => {
    setPasswordData(data)
    setChangePasswordConfirmationDialogOpen(true)
  }

  const updatePassword = async (data: ChangePasswordDataType) => {
    const newPassword = data.password
    const clientId = localStorage.getItem('clientId')
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/user/updatePassword/${clientId}`,
        { newPassword },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        resetForm()
        setChangePasswordConfirmationDialogOpen(false)
        toast.success('Password changed successfully', { hideProgressBar: false })

        localStorage.removeItem('token')
        localStorage.removeItem('storeId')
        localStorage.removeItem('storeName')
        localStorage.removeItem('clientId')
        localStorage.removeItem('clientName')
        const redirectURL = '/login'
        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
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
    <>
      <Card>
        <CardHeader title='Change Password' />
        <CardContent className='flex flex-col gap-4'>
          <Alert icon={false} severity='warning' onClose={() => {}}>
            <AlertTitle>Ensure that these requirements are met</AlertTitle>
            Minimum 8 characters long, uppercase & symbol
          </Alert>
          <form onSubmit={handleSubmit(data => onSubmit(data))}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Password'
                      type={isPasswordShown ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={() => setIsPasswordShown(!isPasswordShown)}
                              onMouseDown={e => e.preventDefault()}
                            >
                              <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
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
                      type={isConfirmPasswordShown ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                              onMouseDown={e => e.preventDefault()}
                            >
                              <i
                                className={isConfirmPasswordShown ? 'ri-eye-off-line text-xl' : 'ri-eye-line text-xl'}
                              />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      value={value}
                      onChange={onChange}
                      {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} className='flex gap-4'>
                <Button variant='contained' type='submit'>
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <ChangePasswordConfirmation
        open={changePasswordConfirmationDialogOpen}
        setOpen={setChangePasswordConfirmationDialogOpen}
        data={passwordData}
        submitApiCall={updatePassword}
      />
    </>
  )
}

export default ChangePassword
