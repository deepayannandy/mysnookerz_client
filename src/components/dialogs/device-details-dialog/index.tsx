'use client'

// React Imports
import { ReactNode, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomAvatar from '@core/components/mui/Avatar'
import axios from 'axios'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'

// Config Imports

type DeviceDetailsDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  deviceDetailData: Partial<DeviceDetailsData>
  setDeviceDetailsData: (deviceDetail: Partial<DeviceDetailsData>) => void
  getDeviceData: () => void
}

export type DeviceDetailsData = {
  id: string
  macId: string
  activationDate: string
  warrantyExpiryDate: string
  warrantyAvailingDate: string[]
}

type Options = {
  icon?: ReactNode
  title?: string
  value?: string
}

const DeviceDetailsDialog = ({
  open,
  setOpen,
  deviceDetailData,
  setDeviceDetailsData,
  getDeviceData
}: DeviceDetailsDialogProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [options, setOptions] = useState([
    {
      key: 'macId',
      icon: 'ri-mac-line',
      title: 'MAC ID'
    },
    {
      key: 'activationDate',
      icon: 'ri-calendar-line',
      title: 'Activation Date'
    },
    {
      key: 'warrantyExpiryDate',
      icon: 'ri-calendar-schedule-fill',
      title: 'Warranty Expiry Date'
    }
  ])

  const addWarrantyAvailingDate = async (date: Date) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/devices/${deviceDetailData.id}`,
        {
          warrantyAvailingDate: date
        },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getDeviceData()
      }
    } catch (error: any) {
      toast(error?.response?.data ?? error?.message)
    }

    setDeviceDetailsData({
      ...deviceDetailData,
      warrantyAvailingDate: [
        ...(deviceDetailData.warrantyAvailingDate as string[]),
        DateTime.fromJSDate(date).toFormat('dd LLL yyyy')
      ]
    })
  }

  return (
    <Dialog fullWidth open={open} onClose={() => setOpen(false)} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-12 sm:pli-16'>
        Device Details
      </DialogTitle>
      <DialogContent className='flex flex-col gap-6 pbs-0 sm:pli-16 sm:pbe-16'>
        <IconButton onClick={() => setOpen(false)} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>
        <Grid container spacing={6} className='pbs-6'>
          {options?.map((option, index) => (
            <Grid item xs={12} md={4} key={index}>
              <div className='flex items-center flex-col gap-4'>
                <CustomAvatar className='bs-[66px] is-[66px] sm:bs-[88px] sm:is-[88px]' color='primary' skin='light'>
                  {typeof option.icon === 'string' ? (
                    <i className={classnames('text-[32px] sm:text-[40px]', option.icon)} />
                  ) : (
                    option.icon
                  )}
                </CustomAvatar>
                <div className='flex flex-col gap-2 text-center'>
                  <Typography className='font-medium' color='text.primary'>
                    {option.title}
                  </Typography>
                  <Typography>{deviceDetailData[option.key as keyof DeviceDetailsData]}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        <Divider className='mbs-6' />
        {/* <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>Warranty Availing Dates</TableHead>
            <TableBody>
              {!deviceDetailData.warrantyAvailingDate?.length ? (
                <tbody>
                  <tr>
                    <td>No data available</td>
                  </tr>
                </tbody>
              ) : (
                deviceDetailData.warrantyAvailingDate.map(row => (
                  <tr key={row}>
                    <td scope='row'>{row}</td>
                  </tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer> */}
        <table>
          <thead>
            <tr>
              <th>Warranty Availing Dates</th>
            </tr>
          </thead>
          {!deviceDetailData.warrantyAvailingDate?.length ? (
            <tbody>
              <tr>
                <td>No data available</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {deviceDetailData.warrantyAvailingDate.map(row => {
                return (
                  <tr key={row}>
                    <td key={row}>{row}</td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
        <Divider className='mbs-6' />
        <div className='flex flex-col gap-5'>
          <div className='inline-flex flex-col gap-2 flex-wrap items-start'>
            <Typography component={InputLabel} htmlFor='refer-email' className='inline-flex whitespace-break-spaces'>
              Add warranty availing date
            </Typography>
            <div className='flex items-center is-full gap-4 flex-wrap sm:flex-nowrap'>
              <AppReactDatepicker
                showYearDropdown
                showMonthDropdown
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                placeholderText='DD/MM/YYYY'
                customInput={<TextField fullWidth size='small' />}
              />
              <Button
                variant='contained'
                className='is-full sm:is-auto'
                onClick={() => addWarrantyAvailingDate(new Date(selectedDate))}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeviceDetailsDialog
