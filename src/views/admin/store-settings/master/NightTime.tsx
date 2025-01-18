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

type NightTimeDataType = {
  nightStartTime: Date
  nightEndTime: Date
}

const NightTime = ({
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
  } = useForm<NightTimeDataType>({
    defaultValues: {
      nightStartTime: new Date(),
      nightEndTime: new Date()
    }
  })

  useEffect(() => {
    resetForm({
      nightStartTime: storeData?.StoreData?.nightStartTime
        ? DateTime.fromISO(storeData?.StoreData?.nightStartTime).toJSDate()
        : new Date(),
      nightEndTime: storeData?.StoreData?.nightEndTime
        ? DateTime.fromISO(storeData?.StoreData?.nightEndTime).toJSDate()
        : new Date()
    })
  }, [storeData, resetForm])

  const onSubmit = async (data: NightTimeDataType) => {
    const nightStartTime = DateTime.fromJSDate(data.nightStartTime).toFormat('HH:mm')
    const nightEndTime = DateTime.fromJSDate(data.nightEndTime).toFormat('HH:mm')

    submitData<{ nightStartTime: string; nightEndTime: string }>(
      { nightStartTime, nightEndTime },
      'Night time updated successfully'
    )
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
