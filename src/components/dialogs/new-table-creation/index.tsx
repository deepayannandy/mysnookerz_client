'use client'

// React Imports
import { useEffect, useState } from 'react'

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
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type NewTableCreationDataType = Partial<{
  tableName: string
  gameType: string
  minuteWiseRules: {
    dayUptoMin: number | null
    dayMinAmt: number | null
    dayPerMin: number | null
    nightUptoMin: number | null
    nightMinAmt: number | null
    nightPerMin: number | null
  }
  deviceId: string
  nodeID: string
}>

type NewTableCreationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: NewTableCreationDataType
  getTableData: () => void
}

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

// const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

const gameTypes = ['Minute Billing']

const NewTableCreation = ({ open, setOpen, getTableData }: NewTableCreationProps) => {
  //const [userData, setUserData] = useState([] as NewTableCreationDataType)
  const [gameType, setGameType] = useState(gameTypes[0])
  const [devices, setDevices] = useState([] as string[])
  const [nodes, setNodes] = useState({} as Record<string, string[]>)
  const [deviceId, setDeviceId] = useState('')
  const [nodeId, setNodeId] = useState('')

  // States
  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<NewTableCreationDataType>({
    //resolver: yupResolver(schema),
    defaultValues: {
      tableName: '',
      gameType: gameType[0],
      minuteWiseRules: {
        dayUptoMin: null,
        dayMinAmt: null,
        dayPerMin: null,
        nightUptoMin: null,
        nightMinAmt: null,
        nightPerMin: null
      },
      deviceId: '',
      nodeID: ''
    }
  })

  const handleClose = () => {
    resetForm()
    setDeviceId('')
    setNodeId('')
    getTableData()
    setOpen(false)
  }

  const onSubmit = async (data: NewTableCreationDataType) => {
    data.deviceId = deviceId
    data.nodeID = nodeId
    data.gameType = gameType

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/table`,
        { ...data, gameTypes: [data.gameType] },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        getTableData()
        setOpen(false)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data || error?.message, { hideProgressBar: false })
    }
  }

  const getDeviceData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = '667e3c007e2ed9e64a9136be' //localStorage.getItem('storeId')
    const nodesData: Record<string, string[]> = {}
    try {
      const response = await axios.get(`${apiBaseUrl}/devices/byStore/${storeId}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        const deviceIds: string[] = response.data.map((data: any) => {
          if (data.deviceId) {
            nodesData[data.deviceId as string] = data.nodes
            return data.deviceId
          }
        })

        setDevices(deviceIds)
        setDeviceId(deviceIds[0])
        setNodes(nodesData)
        setNodeId(nodesData[deviceIds[0]]?.[0])
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data || error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getDeviceData()
  }, [])

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>New Table</div>
        {/* <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography> */}
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='tableName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Table Name'
                    placeholder='Enter table name'
                    value={value}
                    onChange={onChange}
                    {...(errors.tableName && {
                      error: true,
                      helperText: errors.tableName.message || 'This field is required'
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Game Type</InputLabel>
                <Select label='Billing Type' value={gameType} onChange={e => setGameType(e.target.value)}>
                  {gameTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
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
              <Controller
                name='minuteWiseRules.dayUptoMin'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Up To Minute'
                    inputProps={{ type: 'number', min: 0 }}
                    value={value}
                    onChange={onChange}
                    {...(errors.minuteWiseRules?.dayUptoMin && {
                      error: true,
                      helperText: errors.minuteWiseRules?.dayUptoMin?.message || 'This field is required'
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='minuteWiseRules.dayMinAmt'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Minimum Charge'
                    inputProps={{ type: 'number', min: 0, step: 'any' }}
                    value={value}
                    onChange={onChange}
                    {...(errors.minuteWiseRules?.dayMinAmt && {
                      error: true,
                      helperText: errors.minuteWiseRules?.dayMinAmt?.message || 'This field is required'
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='minuteWiseRules.dayPerMin'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Per Minute Charge'
                    inputProps={{ type: 'number', min: 0, step: 'any' }}
                    value={value}
                    onChange={onChange}
                    {...(errors.minuteWiseRules?.dayPerMin && {
                      error: true,
                      helperText: errors.minuteWiseRules?.dayPerMin?.message || 'This field is required'
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <span className='mx-3 font-bold'>Night</span>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='minuteWiseRules.nightUptoMin'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Up To Minute'
                    inputProps={{ type: 'number', min: 0 }}
                    value={value}
                    onChange={onChange}
                    {...(errors.minuteWiseRules?.nightUptoMin && {
                      error: true,
                      helperText: errors.minuteWiseRules?.nightUptoMin?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='minuteWiseRules.nightMinAmt'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Minimum Charge'
                    inputProps={{ type: 'number', min: 0, step: 'any' }}
                    value={value}
                    onChange={onChange}
                    {...(errors.minuteWiseRules?.nightMinAmt && {
                      error: true,
                      helperText: errors.minuteWiseRules?.nightMinAmt?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='minuteWiseRules.nightPerMin'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Per Minute Charge'
                    inputProps={{ type: 'number', min: 0, step: 'any' }}
                    value={value}
                    onChange={onChange}
                    {...(errors.minuteWiseRules?.nightPerMin && {
                      error: true,
                      helperText: errors.minuteWiseRules?.nightPerMin?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select label='Device' value={deviceId} onChange={e => setDeviceId(e.target.value)}>
                  {devices.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Node</InputLabel>
                <Select label='Node' value={nodeId} onChange={e => setNodeId(e.target.value)}>
                  {nodes[deviceId]?.map((type, index) => (
                    <MenuItem key={index} value={type}>
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
