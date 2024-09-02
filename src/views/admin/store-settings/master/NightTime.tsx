'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

// Style Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import '@/libs/styles/tiptapEditor.css'
import Button from '@mui/material/Button'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type NightTimeDataType = {
  nightStartTime: Date
  nightEndTime: Date
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
      nightStartTime: new Date(),
      nightEndTime: new Date()
    }
  })

  const onSubmit = async (data: NightTimeDataType) => {
    const nightStartTime = DateTime.fromJSDate(data.nightStartTime).toFormat('hh:mm a')
    const nightEndTime = DateTime.fromJSDate(data.nightEndTime).toFormat('hh:mm a')

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/store/${storeId}`,
        { nightStartTime, nightEndTime },
        { headers: { 'auth-token': token } }
      )
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
            <Grid item xs={12} md={4}>
              <Controller
                name='nightStartTime'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <AppReactDatepicker
                    showTimeSelect
                    timeIntervals={15}
                    showTimeSelectOnly
                    dateFormat='hh:mm aa'
                    boxProps={{ className: 'is-full' }}
                    selected={value}
                    onChange={onChange}
                    customInput={
                      <TextField
                        label='Start Time'
                        size='small'
                        fullWidth
                        {...(errors.nightStartTime && {
                          error: true,
                          helperText: errors.nightStartTime.message || 'This field is required'
                        })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name='nightEndTime'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <AppReactDatepicker
                    showTimeSelect
                    timeIntervals={15}
                    showTimeSelectOnly
                    dateFormat='hh:mm aa'
                    boxProps={{ className: 'is-full' }}
                    selected={value}
                    onChange={onChange}
                    customInput={
                      <TextField
                        label='End Time'
                        size='small'
                        fullWidth
                        {...(errors.nightEndTime && {
                          error: true,
                          helperText: errors.nightEndTime.message || 'This field is required'
                        })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <div className='flex justify-center'>
                <Button variant='contained' type='submit'>
                  Submit
                </Button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </form>
    </Card>
  )
}

export default NightTime
