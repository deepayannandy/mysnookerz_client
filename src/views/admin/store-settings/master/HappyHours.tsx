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
import { StoreDataType } from '@/types/adminTypes'
import Button from '@mui/material/Button'
import { DateTime } from 'luxon'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

type HappyHoursDataType = {
  happyHoursStartTime: Date
  happyHoursEndTime: Date
  discount: number | string
}

const HappyHours = ({
  storeData,
  submitData
}: {
  storeData: StoreDataType
  submitData: <T>(data: T, message: string) => void
}) => {
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<HappyHoursDataType>({
    defaultValues: {
      happyHoursStartTime: new Date(),
      happyHoursEndTime: new Date(),
      discount: ''
    }
  })

  useEffect(() => {
    resetForm({
      happyHoursStartTime: storeData?.StoreData?.happyHrsStartTime
        ? DateTime.fromISO(storeData?.StoreData?.happyHrsStartTime).toJSDate()
        : new Date(),
      happyHoursEndTime: storeData?.StoreData?.happyHrsEndTime
        ? DateTime.fromISO(storeData?.StoreData?.happyHrsEndTime).toJSDate()
        : new Date(),
      discount: storeData?.StoreData?.happyHrsDiscount ?? ''
    })
  }, [storeData, resetForm])

  const onSubmit = async (data: HappyHoursDataType) => {
    const happyHrsStartTime = DateTime.fromJSDate(data.happyHoursStartTime).toFormat('HH:mm')
    const happyHrsEndTime = DateTime.fromJSDate(data.happyHoursEndTime).toFormat('HH:mm')
    const happyHrsDiscount = data.discount

    submitData<{ happyHrsStartTime: string; happyHrsEndTime: string; happyHrsDiscount: string | number }>(
      { happyHrsStartTime, happyHrsEndTime, happyHrsDiscount },
      'Happy Hours updated successfully'
    )
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
              <Controller
                name='discount'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label='Discount'
                    size='small'
                    fullWidth
                    inputProps={{ type: 'number', min: 0 }}
                    value={value}
                    onChange={onChange}
                    {...(errors.discount && {
                      error: true,
                      helperText: errors.discount?.message || 'This field is required'
                    })}
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
