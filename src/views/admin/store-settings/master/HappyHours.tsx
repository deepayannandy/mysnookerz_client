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
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type HappyHoursDataType = {
  happyHoursStartTime: Date
  happyHoursEndTime: Date
}

const HappyHours = () => {
  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<HappyHoursDataType>({
    defaultValues: {
      happyHoursStartTime: new Date(),
      happyHoursEndTime: new Date()
    }
  })

  const onSubmit = async (data: HappyHoursDataType) => {
    const happyHoursStartTime = DateTime.fromJSDate(data.happyHoursStartTime).toFormat('hh:mm a')
    const happyHoursEndTime = DateTime.fromJSDate(data.happyHoursEndTime).toFormat('hh:mm a')

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    toast.success('Happy Hours updated successfully')

    // try {
    //   const response = await axios.patch(
    //     `${apiBaseUrl}/store/${storeId}`,
    //     { happyHoursStartTime, happyHoursEndTime },
    //     { headers: { 'auth-token': token } }
    //   )
    //   if (response && response.data) {
    //     resetForm()
    //     toast.success('Happy Hours updated successfully')
    //   }
    // } catch (error: any) {
    //   if (error?.response?.status === 401) {
    //     const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
    //     return router.replace(redirectUrl)
    //   }
    //   toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    // }
  }

  return (
    <Card>
      <CardHeader title='Setup Happy Hours' />
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <CardContent>
          <Grid container spacing={5} className='mbe-5'>
            <Grid item xs={12} md={4}>
              <Controller
                name='happyHoursStartTime'
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
                        {...(errors.happyHoursStartTime && {
                          error: true,
                          helperText: errors.happyHoursStartTime.message || 'This field is required'
                        })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name='happyHoursEndTime'
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
                        {...(errors.happyHoursEndTime && {
                          error: true,
                          helperText: errors.happyHoursEndTime.message || 'This field is required'
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

export default HappyHours
