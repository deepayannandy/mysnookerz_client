'use client'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { HistoryDataType } from '@/types/staffTypes'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type EditGameHistoryType = {
  startTime: Date
  endTime: Date
  booking: string | number
  discount: string | number
  netPay: string | number
}

type EditGameHistoryInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  historyData: HistoryDataType
  getHistoryData: () => void
}

const EditGameHistoryInfo = ({ open, setOpen, getHistoryData, historyData }: EditGameHistoryInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<EditGameHistoryType>({
    // resolver: yupResolver(schema),
    defaultValues: {
      startTime: new Date(),
      endTime: new Date(),
      booking: '',
      discount: '',
      netPay: ''
    }
  })

  useEffect(() => {
    resetForm({
      ...historyData,
      startTime: historyData?.startTime ? DateTime.fromISO(historyData.startTime).toJSDate() : new Date(),
      endTime: historyData?.endTime ? DateTime.fromISO(historyData.endTime).toJSDate() : new Date()
    })
  }, [historyData, resetForm])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: EditGameHistoryType) => {
    const startTimeObject = DateTime.fromJSDate(data.startTime)
    const endTimeObject = DateTime.fromJSDate(data.endTime)
    const time = Math.floor(endTimeObject.diff(startTimeObject, 'minutes')?.minutes ?? 0)

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/history/${historyData.transactionId}`,
        { ...data, startTime: startTimeObject.toISO(), endTime: endTimeObject.toISO(), time },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getHistoryData()
        handleClose()
        toast.success('History info updated successfully')
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
        <Typography variant='h5'>{`Edit History Info (${historyData.transactionId})`}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            <Controller
              name='startTime'
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
                      {...(errors.startTime && {
                        error: true,
                        helperText: errors.startTime?.message || 'This field is required'
                      })}
                    />
                  }
                />
              )}
            />

            <Controller
              name='endTime'
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
                      {...(errors.endTime && {
                        error: true,
                        helperText: errors.endTime?.message || 'This field is required'
                      })}
                    />
                  }
                />
              )}
            />

            <Controller
              name='booking'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Booking'
                  size='small'
                  fullWidth
                  inputProps={{ type: 'number', min: 0 }}
                  value={value ?? ''}
                  onChange={onChange}
                  {...(errors.booking && {
                    error: true,
                    helperText: errors.booking?.message || 'This field is required'
                  })}
                />
              )}
            />

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
                  value={value ?? ''}
                  onChange={onChange}
                  {...(errors.discount && {
                    error: true,
                    helperText: errors.discount?.message || 'This field is required'
                  })}
                />
              )}
            />

            <Controller
              name='netPay'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Net Pay'
                  size='small'
                  fullWidth
                  inputProps={{ type: 'number', min: 0 }}
                  value={value ?? ''}
                  onChange={onChange}
                  {...(errors.netPay && {
                    error: true,
                    helperText: errors.netPay?.message || 'This field is required'
                  })}
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
}

export default EditGameHistoryInfo
