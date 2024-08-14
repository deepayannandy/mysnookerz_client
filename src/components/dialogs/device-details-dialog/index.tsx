'use client'

// React Imports
import type { ReactNode } from 'react'
import { useState } from 'react'

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
import axios from 'axios'
import classnames from 'classnames'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomAvatar from '@core/components/mui/Avatar'
import { TableBody, TableHead } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { useParams, usePathname, useRouter } from 'next/navigation'

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
  key?: string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const DeviceDetailsDialog = ({
  open,
  setOpen,
  deviceDetailData,
  setDeviceDetailsData,
  getDeviceData
}: DeviceDetailsDialogProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const options: Options[] = [
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
  ]

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

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
      if (error?.response?.status === 400) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
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
        <div className='flex flex-col gap-2 text-center'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label='customized table'>
              <TableHead>
                <TableCell align='center'>Warranty Availing Dates</TableCell>
              </TableHead>
              {!deviceDetailData.warrantyAvailingDate?.length ? (
                <TableBody>
                  <TableRow>No data available</TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {deviceDetailData.warrantyAvailingDate.map(row => (
                    <StyledTableRow key={row}>
                      <StyledTableCell component='th' scope='row' align='center'>
                        {row}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
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
