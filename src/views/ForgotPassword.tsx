'use client'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, IconButton, InputAdornment } from '@mui/material'
import axios from 'axios'
import { FormEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { ChangePasswordDataType } from './admin/account-settings/user-right/security/ChangePassword'

const ForgotPasswordV2 = ({ mode }: { mode: Mode }) => {
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isOtpValidated, setIsOtpValidated] = useState(false)
  const [email, setEmail] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [clientId, setClientId] = useState('')

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-forgot-password-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-forgot-password-light-border.png'

  // Hooks
  const { lang: locale } = useParams()
  const router = useRouter()
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { settings } = useSettings()

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const generateOTP = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    event.currentTarget.reset()

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const response = await axios.post(`${apiBaseUrl}/user/generateOTP`, data)

      if (response && response.data) {
        setIsCodeSent(true)
        setEmail((data as any).email)
        toast.success('Verification code sent.', { hideProgressBar: false })
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const verifyOTP = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    event.currentTarget.reset()

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

    try {
      const response = await axios.post(`${apiBaseUrl}/user/validateOTP`, { email, ...data })

      if (response && response.data) {
        setIsCodeSent(false)
        setIsOtpValidated(true)
        setClientId(response.data.UserId)
        toast.success('OTP verified successfully', { hideProgressBar: false })
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const updatePassword = async (data: ChangePasswordDataType) => {
    const newPassword = data.password
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const response = await axios.patch(`${apiBaseUrl}/user/updatePassword/${clientId}`, { newPassword })

      if (response && response.data) {
        resetForm()
        toast.success('Password changed successfully', { hideProgressBar: false })

        localStorage.removeItem('clientPassword')
        localStorage.removeItem('token')
        localStorage.removeItem('storeId')
        localStorage.removeItem('storeName')
        localStorage.removeItem('clientId')
        localStorage.removeItem('clientName')
        localStorage.removeItem('subscription')
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

  const schema: yup.ObjectSchema<ChangePasswordDataType> = yup.object().shape({
    password: yup.string().required('This field is required').min(8, 'Password must be at least 8 characters long'),
    confirmPassword: yup
      .string()
      .required('This field is required')
      .oneOf([yup.ref('password'), ''], 'Passwords must match')
  })

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

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedUrl('/', locale as Locale)}
          className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>Forgot Password 🔒</Typography>
            <Typography className='mbs-1'>
              {isOtpValidated
                ? 'Please set a new password'
                : isCodeSent
                  ? `Enter the verification code received on ${email}`
                  : `Enter your email and we'll send you instructions to verification code to your password`}
            </Typography>
          </div>

          {isOtpValidated ? (
            <form onSubmit={handleSubmit(data => updatePassword(data))}>
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
                  <Button fullWidth variant='contained' type='submit'>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : isCodeSent ? (
            <form noValidate autoComplete='off' onSubmit={e => verifyOTP(e)} className='flex flex-col gap-5'>
              <TextField autoFocus fullWidth label='Verification Code' name='otp' />
              <Button fullWidth variant='contained' type='submit'>
                Verify
              </Button>
            </form>
          ) : (
            <form noValidate autoComplete='off' onSubmit={e => generateOTP(e)} className='flex flex-col gap-5'>
              <TextField autoFocus fullWidth label='Email' name='email' />
              <Button fullWidth variant='contained' type='submit'>
                Send Verification Code
              </Button>
            </form>
          )}

          <Typography className='flex justify-center items-center' color='primary'>
            <Link href='/login' className='flex items-center'>
              <i className='ri-arrow-left-s-line' />
              <span>Back to Login</span>
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordV2
