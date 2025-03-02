'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// Type Imports
import type { Locale } from '@/configs/i18n'
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import UpgradePlan from '@/components/dialogs/upgrade-plan'
import { UserDataType } from '@/types/adminTypes'
import { getLocalizedUrl } from '@/utils/i18n'
import axios from 'axios'
import { toast } from 'react-toastify'

type ErrorType = {
  message: string[]
}

type FormData = yup.InferType<typeof schema>

const schema = yup.object().shape({
  email: yup.string().required('This field is required'),
  password: yup.string().min(5, 'Password must be at least 5 characters long').required('This field is required')
})

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [serverError, setSeverError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [isPlanExpired, setIsPlanExpired] = useState(false)
  const [userData, setUserData] = useState({} as UserDataType)

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const pathname = usePathname()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: localStorage.getItem('clientEmail') || '',
      password: localStorage.getItem('clientPassword') || ''
    }
  })

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

    try {
      const response = await axios.post(`${apiBaseUrl}/user/clientLogin`, {
        userId: data.email,
        password: data.password
      })

      if (response && response.data) {
        localStorage.setItem('token', response.data.auth_token)
        localStorage.setItem('storeId', response.data.storeId)
        if (rememberMe) {
          localStorage.setItem('clientEmail', data.email)
          localStorage.setItem('clientPassword', data.password)
        } else {
          localStorage.removeItem('clientEmail')
          localStorage.removeItem('clientPassword')
        }
        const redirectURL = searchParams.get('redirectTo') ?? '/'

        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
      } else if (response.status !== 200) {
        if (response?.data?.error) {
          const error = JSON.parse(response?.data?.error)

          setErrorState(error)
        }
      }
    } catch (error: any) {
      if (error.response?.data?.ErrorId === 'SUBSCRIPTION_OVER') {
        setIsPlanExpired(true)
        localStorage.setItem('token', error.response.data.token)
        localStorage.setItem('storeId', error.response.data.storeId)

        if (rememberMe) {
          localStorage.setItem('clientEmail', data.email)
          localStorage.setItem('clientPassword', data.password)
        } else {
          localStorage.removeItem('clientEmail')
          localStorage.removeItem('clientPassword')
        }
        getUserData()
      }

      setSeverError(error?.response?.data?.message ?? error?.message)
    }
  }

  const getUserData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setUserData(response.data)
        if (typeof response.data.SubscriptionData !== 'string' && response.data.SubscriptionData) {
          setIsPlanExpired(false)
          setSeverError('')
        }
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    localStorage.removeItem('token')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
            <Typography>{`${isPlanExpired ? 'Please renew you subscription' : 'Please sign-in to your account and start the adventure'}`}</Typography>
          </div>

          <form
            noValidate
            action={() => {}}
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            {!isPlanExpired ? (
              <>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      type='email'
                      label='Email/Mobile'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.email || errorState !== null) && {
                        error: true,
                        helperText: errors?.email?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Password'
                      id='login-password'
                      type={isPasswordShown ? 'text' : 'password'}
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={handleClickShowPassword}
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      {...(errors.password && { error: true, helperText: errors.password.message })}
                    />
                  )}
                />
                <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
                  <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} />}
                    label='Remember me'
                  />
                  <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                    Forgot password?
                  </Typography>
                </div>
                <Button fullWidth variant='contained' type='submit'>
                  Log In
                </Button>
              </>
            ) : (
              <OpenDialogOnElementClick
                element={Button}
                elementProps={{
                  variant: 'contained',
                  children: 'Renew Subscription'
                }}
                dialog={UpgradePlan}
                dialogProps={{
                  getUserData,
                  userData,
                  isLoginScreen: true
                }}
              />
            )}

            {serverError ? (
              <Alert variant='filled' severity='error'>
                {serverError}
              </Alert>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
