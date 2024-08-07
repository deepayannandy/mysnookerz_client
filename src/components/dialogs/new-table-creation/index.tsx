'use client'

// React Imports
import { FormEvent, useState } from 'react'

// MUI Imports
import { Divider } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { useParams, usePathname, useRouter } from 'next/navigation'

type NewTableCreationDataType = Partial<{
  name: string
  billingType: string
  day: Partial<{
    upToMinute: number | null
    minimumCharge: number | null
    perMinuteCharge: number | null
  }>
  night: Partial<{
    upToMinute: number | null
    minimumCharge: number | null
    perMinuteCharge: number | null
  }>
  device: string
  mode: string
}>

type NewTableCreationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: NewTableCreationDataType
  getStaffData?: () => void
}

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

// const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

const countries = ['India']

const subscriptions = ['Starter', 'Standard', 'Ultimate', 'Enterprise']
const billingTypes = ['Minute Billing']
const devices = ['Andriod', 'IOS']
const modes = ['Abc', 'Xyz']

const NewTableCreation = ({ open, setOpen }: NewTableCreationProps) => {
  const [userData, setUserData] = useState([] as NewTableCreationDataType)
  // States
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log({ userData })
    // const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    // try {
    //   const response = await axios.post(`${apiBaseUrl}/user/register`, data)

    //   if (response && response.data) {
    //     setOpen(false)
    //   }
    // } catch (error: any) {
    //   if (error?.response?.status === 400) {
    //     const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
    //     return router.replace(redirectUrl)
    //   }
    //   toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    // }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>New Registration</div>
        {/* <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography> */}
      </DialogTitle>
      <form onSubmit={e => handleSubmit(e)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Table Name'
                placeholder='Enter table name'
                value={userData?.name}
                onChange={e => setUserData({ ...userData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Billing Type</InputLabel>
                <Select
                  label='Billing Type'
                  value={userData?.billingType?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setUserData({ ...userData, billingType: e.target.value })}
                >
                  {billingTypes.map((type, index) => (
                    <MenuItem key={index} value={type.toLowerCase().replace(/\s+/g, '-')}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <span className='mx-3 font-bold'>Day</span>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Up To Minute'
                value={userData?.day?.upToMinute}
                inputProps={{ type: 'number', min: 0 }}
                onChange={e =>
                  setUserData({
                    ...userData,
                    day: { ...userData.day, upToMinute: Number(e.target.value) ? Number(e.target.value) : null }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Minimum Charge'
                value={userData?.day?.minimumCharge}
                inputProps={{ type: 'number', min: 0 }}
                onChange={e =>
                  setUserData({
                    ...userData,
                    day: { ...userData.day, minimumCharge: Number(e.target.value) ? Number(e.target.value) : null }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name='perMinuteCharge'
                fullWidth
                label='Per Minute Charge'
                value={userData?.day?.perMinuteCharge}
                inputProps={{ type: 'number', min: 0 }}
                onChange={e =>
                  setUserData({
                    ...userData,
                    day: { ...userData.day, perMinuteCharge: Number(e.target.value) ? Number(e.target.value) : null }
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <span className='mx-3 font-bold'>Night</span>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Up To Minute'
                value={userData?.night?.upToMinute}
                inputProps={{ type: 'number', min: 0 }}
                onChange={e =>
                  setUserData({
                    ...userData,
                    night: { ...userData.night, upToMinute: Number(e.target.value) ? Number(e.target.value) : null }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Minimum Charge'
                value={userData?.night?.minimumCharge}
                inputProps={{ type: 'number', min: 0 }}
                onChange={e =>
                  setUserData({
                    ...userData,
                    night: { ...userData.night, minimumCharge: Number(e.target.value) ? Number(e.target.value) : null }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Per Minute Charge'
                value={userData?.night?.perMinuteCharge}
                inputProps={{ type: 'number', min: 0 }}
                onChange={e =>
                  setUserData({
                    ...userData,
                    night: {
                      ...userData.night,
                      perMinuteCharge: Number(e.target.value) ? Number(e.target.value) : null
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select
                  label='Device'
                  value={userData?.device?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setUserData({ ...userData, device: e.target.value })}
                >
                  {devices.map((type, index) => (
                    <MenuItem key={index} value={type.toLowerCase().replace(/\s+/g, '-')}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mode</InputLabel>
                <Select
                  label='Mode'
                  value={userData?.mode?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setUserData({ ...userData, mode: e.target.value })}
                >
                  {modes.map((type, index) => (
                    <MenuItem key={index} value={type.toLowerCase().replace(/\s+/g, '-')}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default NewTableCreation
