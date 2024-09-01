'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

// Third-party Imports

// Components Imports

// Style Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import '@/libs/styles/tiptapEditor.css'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type NightTimeDataType = {
  startTime: Date
  endTime: Date
}

const NightTime = () => {
  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<NightTimeDataType>({
    defaultValues: {
      startTime: new Date(),
      endTime: new Date()
    }
  })

  const onSubmit = async (data: any) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    try {
      const response = await axios.patch(`${apiBaseUrl}/store/${storeId}`, data, { headers: { 'auth-token': token } })
      if (response && response.data) {
        resetForm()
        toast.success('Night time updated successfully')
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Card>
      <CardHeader title='Setup Night Time' />
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <CardContent>
          <Grid container spacing={5} className='mbe-5'>
            <Grid item xs={12} sm={6}>
              <Controller
                name='startTime'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <AppReactDatepicker
                    showYearDropdown
                    showMonthDropdown
                    boxProps={{ className: 'is-full' }}
                    selected={value}
                    placeholderText='dd/MM/yyyy'
                    dateFormat={'dd/MM/yyyy'}
                    onChange={onChange}
                    customInput={
                      <TextField
                        fullWidth
                        size='small'
                        {...(errors.startTime && {
                          error: true,
                          helperText: errors.startTime.message || 'This field is required'
                        })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='endTime'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <AppReactDatepicker
                    showYearDropdown
                    showMonthDropdown
                    boxProps={{ className: 'is-full' }}
                    selected={value}
                    placeholderText='DD/MM/YYYY'
                    dateFormat={'dd/MM/yyyy'}
                    onChange={onChange}
                    customInput={
                      <TextField
                        fullWidth
                        size='small'
                        {...(errors.endTime && {
                          error: true,
                          helperText: errors.endTime.message || 'This field is required'
                        })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <div className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
            </div>
          </Grid>
        </CardContent>
      </form>
    </Card>
  )
}

export default NightTime
