'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CustomIconButton from '@/@core/components/mui/IconButton'
import { Checkbox, Divider, FormControlLabel } from '@mui/material'
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
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type NewTableCreationDataType = Partial<{
  tableName: string
  gameType: string[]
  minuteWiseRules: Partial<{
    dayUptoMin: number | null
    dayMinAmt: number | null
    dayPerMin: number | null
    nightUptoMin: number | null
    nightMinAmt: number | null
    nightPerMin: number | null
  }>
  slotWiseRules: {
    uptoMin: number | null
    slotCharge: number | null
    nightSlotCharge: number | null
  }[]
  countdownRules: {
    uptoMin: number | null
    countdownDayCharge: number | null
    countdownNightCharge: number | null
  }[]
  frameRules: Partial<{
    frameDayCharge: number | null
    frameNightCharge: number | null
  }>
  fixedBillingRules: Partial<{
    dayAmt: number | null
    nightAmt: number | null
  }>
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

const NewTableCreation = ({ open, setOpen, getTableData }: NewTableCreationProps) => {
  //const [userData, setUserData] = useState([] as NewTableCreationDataType)
  const [devices, setDevices] = useState([] as string[])
  const [nodes, setNodes] = useState({} as Record<string, string[]>)
  const [deviceId, setDeviceId] = useState('')
  const [nodeId, setNodeId] = useState('')
  const [isMinuteBillingSelected, setIsMinuteBillingSelected] = useState(true)
  const [isSlotBillingSelected, setIsSlotBillingSelected] = useState(true)
  const [isCountdownBillingSelected, setIsCountdownBillingSelected] = useState(true)
  const [isFrameBillingSelected, setIsFrameBillingSelected] = useState(false)
  const [isFixedBillingSelected, setIsFixedBillingSelected] = useState(true)

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
      minuteWiseRules: {
        dayUptoMin: null,
        dayMinAmt: null,
        dayPerMin: null,
        nightUptoMin: null,
        nightMinAmt: null,
        nightPerMin: null
      },
      slotWiseRules: [
        {
          uptoMin: null,
          slotCharge: null,
          nightSlotCharge: null
        }
      ],
      countdownRules: [
        {
          uptoMin: null,
          countdownDayCharge: null,
          countdownNightCharge: null
        }
      ],
      frameRules: {
        frameDayCharge: null,
        frameNightCharge: null
      },
      fixedBillingRules: {
        dayAmt: null,
        nightAmt: null
      },
      deviceId: '',
      nodeID: ''
    }
  })

  const {
    fields: slotFields,
    append: slotAppend,
    remove: slotRemove
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'slotWiseRules' // unique name for your Field Array
  })

  const {
    fields: countdownFields,
    append: countdownAppend,
    remove: countdownRemove
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'countdownRules' // unique name for your Field Array
  })

  const handleClose = () => {
    resetForm()
    setDeviceId('')
    setNodeId('')
    setIsMinuteBillingSelected(true)
    setIsSlotBillingSelected(true)
    setIsCountdownBillingSelected(true)
    setIsFrameBillingSelected(true)
    setIsFixedBillingSelected(true)
    getTableData()
    setOpen(false)
  }

  const onSubmit = async (data: NewTableCreationDataType) => {
    const gameTypes = []
    if (isMinuteBillingSelected) {
      gameTypes.push('Minute Billing')
    }
    if (isSlotBillingSelected) {
      gameTypes.push('Slot Billing')
    }
    if (isCountdownBillingSelected) {
      gameTypes.push('Countdown Billing')
    }
    if (isFrameBillingSelected) {
      gameTypes.push('Frame Billing')
    }
    if (isFixedBillingSelected) {
      gameTypes.push('Fixed Billing')
    }

    if (!gameTypes.length) {
      toast.error('Please select at least one billing type')
      return
    }

    if (!isMinuteBillingSelected) {
      data.minuteWiseRules = {}
    }

    if (!isSlotBillingSelected) {
      data.slotWiseRules = []
    }

    if (!isCountdownBillingSelected) {
      data.countdownRules = []
    }

    if (!isFrameBillingSelected) {
      data.frameRules = {}
    }

    if (!isFixedBillingSelected) {
      data.fixedBillingRules = {}
    }

    data.deviceId = deviceId
    data.nodeID = nodeId

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/table`,
        { ...data, gameTypes },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        handleClose()

        toast.success('Table added successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message || error?.message, { hideProgressBar: false })
    }
  }

  const getDeviceData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
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
        // setDeviceId(deviceIds[0])
        setNodes(nodesData)
        // setNodeId(nodesData[deviceIds[0]]?.[0])
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data || error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getDeviceData()
  }, [open])

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>New Table</div>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={isMinuteBillingSelected}
                    onChange={event => setIsMinuteBillingSelected(event.target.checked)}
                  />
                }
                label='Minute Billing'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={isSlotBillingSelected}
                    onChange={event => setIsSlotBillingSelected(event.target.checked)}
                  />
                }
                label='Slot Billing'
              />
              {/* <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={isFrameBillingSelected}
                    onChange={event => setIsFrameBillingSelected(event.target.checked)}
                  />
                }
                label='Frame Billing'
              /> */}
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={isFixedBillingSelected}
                    onChange={event => setIsFixedBillingSelected(event.target.checked)}
                  />
                }
                label='Fixed Billing'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={isCountdownBillingSelected}
                    onChange={event => setIsCountdownBillingSelected(event.target.checked)}
                  />
                }
                label='Countdown Billing'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='tableName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size='small'
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
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Billing</InputLabel>
                <Select label='Billing' value={gameType} onChange={e => setGameType(e.target.value)}>
                  {gameTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

            {isMinuteBillingSelected ? (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <span className='mx-3 font-bold'>Day</span>
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='minuteWiseRules.dayUptoMin'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
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
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='minuteWiseRules.dayMinAmt'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
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
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='minuteWiseRules.dayPerMin'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
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
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='minuteWiseRules.nightUptoMin'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
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
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='minuteWiseRules.nightMinAmt'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
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
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='minuteWiseRules.nightPerMin'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
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
              </>
            ) : (
              <></>
            )}

            {isSlotBillingSelected ? (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <span className='mx-3 font-bold'>Slot Billing</span>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  {slotFields.map((field, index) => (
                    <div key={field.id} className='flex flex-col sm:flex-row items-start mbe-4 gap-3'>
                      <Controller
                        name={`slotWiseRules.${index}.uptoMin`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            size='small'
                            fullWidth
                            label='Up To Minute'
                            inputProps={{ type: 'number', min: 0 }}
                            value={value}
                            onChange={onChange}
                            {...(errors.slotWiseRules?.[index]?.uptoMin && {
                              error: true,
                              helperText: errors.slotWiseRules?.[index]?.uptoMin?.message || 'This field is required'
                            })}
                          />
                        )}
                      />

                      <Controller
                        name={`slotWiseRules.${index}.slotCharge`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            size='small'
                            fullWidth
                            label='Day Charge'
                            inputProps={{ type: 'number', min: 0, step: 'any' }}
                            value={value}
                            onChange={onChange}
                            {...(errors.slotWiseRules?.[index]?.slotCharge && {
                              error: true,
                              helperText: errors.slotWiseRules?.[index]?.slotCharge?.message || 'This field is required'
                            })}
                          />
                        )}
                      />

                      <Controller
                        name={`slotWiseRules.${index}.nightSlotCharge`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            size='small'
                            fullWidth
                            label='Night Charge'
                            inputProps={{ type: 'number', min: 0, step: 'any' }}
                            value={value}
                            onChange={onChange}
                            {...(errors.slotWiseRules?.[index]?.nightSlotCharge && {
                              error: true,
                              helperText:
                                errors.slotWiseRules?.[index]?.nightSlotCharge?.message || 'This field is required'
                            })}
                          />
                        )}
                      />

                      {slotFields.length > 1 ? (
                        <CustomIconButton onClick={() => slotRemove(index)} className='min-is-fit'>
                          <i className='ri-close-line' />
                        </CustomIconButton>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                  <Button
                    className='min-is-fit'
                    size='small'
                    variant='contained'
                    onClick={() => slotAppend({ uptoMin: null, slotCharge: null, nightSlotCharge: null })}
                    startIcon={<i className='ri-add-line' />}
                  >
                    Add Item
                  </Button>
                </Grid>
              </>
            ) : (
              <></>
            )}

            {isCountdownBillingSelected ? (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <span className='mx-3 font-bold'>Countdown Billing</span>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  {countdownFields.map((field, index) => (
                    <div key={field.id} className='flex flex-col sm:flex-row items-start mbe-4 gap-3'>
                      <Controller
                        name={`countdownRules.${index}.uptoMin`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            size='small'
                            fullWidth
                            label='Up To Minute'
                            inputProps={{ type: 'number', min: 0 }}
                            value={value}
                            onChange={onChange}
                            {...(errors.countdownRules?.[index]?.uptoMin && {
                              error: true,
                              helperText: errors.countdownRules?.[index]?.uptoMin?.message || 'This field is required'
                            })}
                          />
                        )}
                      />

                      <Controller
                        name={`countdownRules.${index}.countdownDayCharge`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            size='small'
                            fullWidth
                            label='Day Charge'
                            inputProps={{ type: 'number', min: 0, step: 'any' }}
                            value={value}
                            onChange={onChange}
                            {...(errors.countdownRules?.[index]?.countdownDayCharge && {
                              error: true,
                              helperText:
                                errors.countdownRules?.[index]?.countdownDayCharge?.message || 'This field is required'
                            })}
                          />
                        )}
                      />

                      <Controller
                        name={`countdownRules.${index}.countdownNightCharge`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            size='small'
                            fullWidth
                            label='Night Charge'
                            inputProps={{ type: 'number', min: 0, step: 'any' }}
                            value={value}
                            onChange={onChange}
                            {...(errors.countdownRules?.[index]?.countdownNightCharge && {
                              error: true,
                              helperText:
                                errors.countdownRules?.[index]?.countdownNightCharge?.message ||
                                'This field is required'
                            })}
                          />
                        )}
                      />

                      {countdownFields.length > 1 ? (
                        <CustomIconButton onClick={() => countdownRemove(index)} className='min-is-fit'>
                          <i className='ri-close-line' />
                        </CustomIconButton>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                  <Button
                    className='min-is-fit'
                    size='small'
                    variant='contained'
                    onClick={() =>
                      countdownAppend({ uptoMin: null, countdownDayCharge: null, countdownNightCharge: null })
                    }
                    startIcon={<i className='ri-add-line' />}
                  >
                    Add Item
                  </Button>
                </Grid>
              </>
            ) : (
              <></>
            )}

            {isFrameBillingSelected ? (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <span className='mx-3 font-bold'>Frame Billing</span>
                  </Divider>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`frameRules.frameDayCharge`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        fullWidth
                        label='Day Charge'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={value}
                        onChange={onChange}
                        {...(errors.frameRules?.frameDayCharge && {
                          error: true,
                          helperText: errors.frameRules?.frameDayCharge?.message || 'This field is required'
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`frameRules.frameNightCharge`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        fullWidth
                        label='Night Charge'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={value}
                        onChange={onChange}
                        {...(errors.frameRules?.frameNightCharge && {
                          error: true,
                          helperText: errors.frameRules?.frameNightCharge?.message || 'This field is required'
                        })}
                      />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}

            {isFixedBillingSelected ? (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <span className='mx-3 font-bold'>Fixed Billing</span>
                  </Divider>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`fixedBillingRules.dayAmt`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        fullWidth
                        label='Day Charge'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={value}
                        onChange={onChange}
                        {...(errors.fixedBillingRules?.dayAmt && {
                          error: true,
                          helperText: errors.fixedBillingRules?.dayAmt?.message || 'This field is required'
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`fixedBillingRules.nightAmt`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        fullWidth
                        label='Night Charge'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={value}
                        onChange={onChange}
                        {...(errors.fixedBillingRules?.nightAmt && {
                          error: true,
                          helperText: errors.fixedBillingRules?.nightAmt?.message || 'This field is required'
                        })}
                      />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}

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
