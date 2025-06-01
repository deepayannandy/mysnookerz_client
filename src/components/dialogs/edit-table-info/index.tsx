'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CustomIconButton from '@/@core/components/mui/IconButton'
import { BillingTypeEnum, TableTypes } from '@/types/adminTypes'
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
import _ from 'lodash'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getPlanAccessControl } from '@/utils/Utils'

type EditTableDataType = {
  _id: string
  tableName: string
  tableType: string
  gameTypes: string[]
  minuteWiseRules: Partial<{
    dayUptoMin: number | null
    dayMinAmt: number | null
    dayPerMin: number | null
    nightUptoMin: number | null
    nightMinAmt: number | null
    nightPerMin: number | null
  }>
  slotWiseRules: Partial<{
    uptoMin: number | null
    slotCharge: number | null
    nightSlotCharge: number | null
  }>[]
  countdownRules: Partial<{
    uptoMin: number | null
    countdownDayCharge: number | null
    countdownNightCharge: number | null
  }>[]
  fixedBillingRules: Partial<{
    dayAmt: number | null
    nightAmt: number | null
  }>
  isBreak: boolean
  deviceId: string
  nodeID: string
}

type EditTableInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  tableData: EditTableDataType
  getTableData: () => void
}

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

// const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

const EditTableInfo = ({ open, setOpen, getTableData, tableData }: EditTableInfoProps) => {
  const isMinuteBilling = tableData?.gameTypes?.includes('Minute Billing') ?? false
  const isSlotBilling = tableData?.gameTypes?.includes('Slot Billing') ?? false
  const isCountdownBilling = tableData?.gameTypes?.includes('Countdown Billing') ?? false
  const isFixedBilling = tableData?.gameTypes?.includes('Fixed Billing') ?? false

  const [devices, setDevices] = useState([] as string[])
  const [nodes, setNodes] = useState({} as Record<string, string[]>)
  const [deviceId, setDeviceId] = useState('')
  const [nodeId, setNodeId] = useState('')
  const [isMinuteBillingSelected, setIsMinuteBillingSelected] = useState(false)
  const [isSlotBillingSelected, setIsSlotBillingSelected] = useState(false)
  const [isCountdownBillingSelected, setIsCountdownBillingSelected] = useState(false)
  const [isFixedBillingSelected, setIsFixedBillingSelected] = useState(false)
  const [isBreakBillingSelected, setIsBreakBillingSelected] = useState(false)

  // States
  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()
  const planAccessControl = getPlanAccessControl()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<EditTableDataType, '_id'>({
    //resolver: yupResolver(schema),
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

  useEffect(() => {
    resetForm(_.omit(tableData, 'deviceId', 'nodeID', 'gameType'))
    setDeviceId(tableData.deviceId)
    setNodeId(tableData.nodeID)
    setIsMinuteBillingSelected(isMinuteBilling)
    setIsSlotBillingSelected(isSlotBilling)
    setIsCountdownBillingSelected(isCountdownBilling)
    setIsFixedBillingSelected(isFixedBilling)
    setIsBreakBillingSelected(!!tableData.isBreak)

    if (!isSlotBilling) {
      slotAppend({ uptoMin: null, slotCharge: null, nightSlotCharge: null })
    }

    if (!isCountdownBilling) {
      countdownAppend({ uptoMin: null, countdownDayCharge: null, countdownNightCharge: null })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, resetForm])

  useEffect(() => {
    getDeviceData()
  }, [])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: EditTableDataType) => {
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
    if (isFixedBillingSelected) {
      gameTypes.push('Fixed Billing')
    }

    if (!gameTypes.length) {
      toast.error('Please select at least one billing type')
      return
    }

    if (planAccessControl.billingType === BillingTypeEnum.ONE && gameTypes.length > 1) {
      toast.error('Please select only one billing type')
      return
    }

    if (planAccessControl.billingType === BillingTypeEnum.TWO && gameTypes.length > 2) {
      toast.error('Please select only two billing type')
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

    if (!isFixedBillingSelected) {
      data.fixedBillingRules = {}
    }

    data.isBreak = isBreakBillingSelected

    const requestData: Omit<EditTableDataType, '_id'> = {
      ..._.omit(data, '_id', 'gameTypes'),
      deviceId,
      nodeID: nodeId,
      gameTypes
    }
    // requestData.deviceId = deviceId
    // requestData.nodeID = nodeId
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(`${apiBaseUrl}/table/${tableData._id}`, requestData, {
        headers: { 'auth-token': token }
      })

      if (response && response.data) {
        getTableData()
        resetForm()
        setOpen(false)
        toast.success('Table info updated successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data || error?.message, { hideProgressBar: false })
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
        setNodes(nodesData)
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data || error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Edit Table Info</div>
        {/* <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography> */}
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container gap={2}>
            <Grid container item justifyContent='space-between' gap={2} className='p-4'>
              <Grid item xs={12} sm={5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMinuteBillingSelected}
                      onChange={event => setIsMinuteBillingSelected(event.target.checked)}
                    />
                  }
                  label='Minute Billing'
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSlotBillingSelected}
                      onChange={event => setIsSlotBillingSelected(event.target.checked)}
                    />
                  }
                  label='Slot Billing'
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      checked={isBreakBillingSelected}
                      onChange={event => setIsBreakBillingSelected(event.target.checked)}
                    />
                  }
                  label='Break Billing'
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isFixedBillingSelected}
                      onChange={event => setIsFixedBillingSelected(event.target.checked)}
                    />
                  }
                  label='Fixed Billing'
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isCountdownBillingSelected}
                      onChange={event => setIsCountdownBillingSelected(event.target.checked)}
                    />
                  }
                  label='Countdown Billing'
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Controller
                  name='tableName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      size='small'
                      fullWidth
                      label='Table Name'
                      placeholder='Enter Table Name'
                      value={value}
                      onChange={onChange}
                      {...(errors.tableName && {
                        error: true,
                        helperText: errors.tableName.message || 'This field is required'
                      })}
                    />
                  )}
                />

                <Controller
                  name='tableType'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      inputProps={{
                        enterKeyHint: 'enter'
                      }}
                      className='mt-4'
                      size='small'
                      fullWidth
                      select
                      label='Table Type'
                      placeholder='Table Type'
                      value={value}
                      onChange={onChange}
                      {...(errors.tableType && {
                        error: true,
                        helperText: errors.tableType.message || 'This field is required'
                      })}
                    >
                      {TableTypes?.map(type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Billing</InputLabel>
                <Select disabled={true} label='Billing' value={gameType} onChange={e => setGameType(e.target.value)}>
                  {gameTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            </Grid>
            {isMinuteBillingSelected ? (
              <Grid container item rowGap={2} columnSpacing={2} className='border-2 p-4'>
                <div className='grid place-content-center w-full font-bold text-lg'>Minute Billing</div>
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
              </Grid>
            ) : (
              <></>
            )}

            {isSlotBillingSelected ? (
              <Grid container item rowGap={2} columnSpacing={2} className='border-2 p-4'>
                <div className='grid place-content-center w-full font-bold text-lg'>Slot Billing</div>
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
                            inputProps={{ type: 'tel', min: 0, step: 'any' }}
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
                            inputProps={{ type: 'tel', min: 0, step: 'any' }}
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
              </Grid>
            ) : (
              <></>
            )}

            {isCountdownBillingSelected ? (
              <Grid container item rowGap={2} columnSpacing={2} className='border-2 p-4'>
                <div className='grid place-content-center w-full font-bold text-lg'>Countdown Billing</div>
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
                            inputProps={{ type: 'tel', min: 0, step: 'any' }}
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
                            inputProps={{ type: 'tel', min: 0, step: 'any' }}
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
              </Grid>
            ) : (
              <></>
            )}

            {isFixedBillingSelected ? (
              <Grid container item rowGap={2} columnSpacing={2} className='border-2 p-4'>
                <div className='grid place-content-center w-full font-bold text-lg'>Fixed Billing</div>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name={`fixedBillingRules.dayAmt`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        fullWidth
                        label='Day Charge'
                        inputProps={{ type: 'tel', min: 0, step: 'any' }}
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
                <Grid item xs={12} sm={6}>
                  <Controller
                    name={`fixedBillingRules.nightAmt`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        fullWidth
                        label='Night Charge'
                        inputProps={{ type: 'tel', min: 0, step: 'any' }}
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
              </Grid>
            ) : (
              <></>
            )}

            <Grid container item rowGap={2} columnSpacing={2} className='border-2 p-4'>
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

export default EditTableInfo
