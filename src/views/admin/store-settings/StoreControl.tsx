'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// Style Imports
import '@/libs/styles/tiptapEditor.css'
import { StoreDataType } from '@/types/adminTypes'
import { Divider, FormControl, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const StoreControl = ({ storeData, getStoreData }: { storeData: StoreDataType; getStoreData: () => void }) => {
  const [requiredCustomerCount, setRequiredCustomerCount] = useState(1)
  const [isRequiredCustomerCountSwitch, setIsRequiredCustomerCountSwitch] = useState(true)
  const [isCancelGameSwitch, setIsCancelGameSwitch] = useState(true)
  const [isPauseAndResumeSwitch, setIsPauseAndResumeSwitch] = useState(true)
  const [isBillPrintSwitch, setIsBillPrintSwitch] = useState(true)
  const [isPrepaidModeSwitch, setIsPrepaidModeSwitch] = useState(true)
  const [isRoundOffSwitch, setIsRoundOffSwitch] = useState(true)
  const [isSwitchTableSwitch, setIsSwitchTableSwitch] = useState(true)
  const [isMultipleBillingSwitch, setIsMultipleBillingSwitch] = useState(true)
  const [isSelfStartSwitch, setIsSelfStartSwitch] = useState(true)
  const [isBreakGameSwitch, setIsBreakGameSwitch] = useState(true)
  const [cancelMinutes, setCancelMinutes] = useState('0')

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const { handleSubmit } = useForm({})

  useEffect(() => {
    if (storeData?.StoreData?.requiredCustomerCount) {
      setRequiredCustomerCount(storeData?.StoreData?.requiredCustomerCount)
      setIsRequiredCustomerCountSwitch(true)
    } else {
      setRequiredCustomerCount(0)
      setIsRequiredCustomerCountSwitch(false)
    }

    setIsCancelGameSwitch(!!storeData?.StoreData?.isCancel)
    setIsPauseAndResumeSwitch(!!storeData?.StoreData?.isPauseResume)
    setIsBillPrintSwitch(!!storeData?.StoreData?.isBillPrint)
    setIsPrepaidModeSwitch(!!storeData?.StoreData?.isPrepaidMode)
    setIsRoundOffSwitch(!!storeData?.StoreData?.isRoundOff)
    setIsSwitchTableSwitch(!!storeData?.StoreData?.isSwitchTable)
    setIsMultipleBillingSwitch(!!storeData?.StoreData?.isMultipleBilling)
    setIsSelfStartSwitch(!!storeData?.StoreData?.isSelfStart)
    setIsBreakGameSwitch(!!storeData?.StoreData?.isBreakGame)
    setCancelMinutes(`${storeData?.StoreData?.cancelMins}`)
  }, [storeData])

  const onSubmit = async () => {
    const requestData = {
      requiredCustomerCount,
      isCancel: isCancelGameSwitch,
      isPauseResume: isPauseAndResumeSwitch,
      isRoundOff: isRoundOffSwitch,
      isBillPrint: isBillPrintSwitch,
      isPrepaidMode: isPrepaidModeSwitch,
      isSwitchTable: isSwitchTableSwitch,
      isMultipleBilling: isMultipleBillingSwitch,
      isSelfStart: isSelfStartSwitch,
      isBreakGame: isBreakGameSwitch,
      cancelMins: isCancelGameSwitch ? cancelMinutes : 0
    }

    if (!isRequiredCustomerCountSwitch) {
      requestData.requiredCustomerCount = 0
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    try {
      const response = await axios.patch(`${apiBaseUrl}/store/${storeId}`, requestData, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        getStoreData()
        toast.success('Store control updated successfully')
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const handleIsRequiredCustomerCountSwitch = (value: boolean) => {
    if (value) {
      setIsRequiredCustomerCountSwitch(true)
      setRequiredCustomerCount(1)
    } else {
      setIsRequiredCustomerCountSwitch(false)
      setRequiredCustomerCount(0)
    }
  }

  const controlFields = [
    {
      name: 'Required Customer Count',
      setMethod: handleIsRequiredCustomerCountSwitch,
      value: isRequiredCustomerCountSwitch
    },
    {
      name: 'Cancel Game',
      setMethod: setIsCancelGameSwitch,
      value: isCancelGameSwitch
    },
    {
      name: 'Pause/Resume',
      setMethod: setIsPauseAndResumeSwitch,
      value: isPauseAndResumeSwitch
    },
    {
      name: 'Bill Print',
      setMethod: setIsBillPrintSwitch,
      value: isBillPrintSwitch
    },
    {
      name: 'Prepaid Mode (Pay & Play Advance Payment)',
      setMethod: setIsPrepaidModeSwitch,
      value: isPrepaidModeSwitch
    },
    {
      name: 'Round Off',
      setMethod: setIsRoundOffSwitch,
      value: isRoundOffSwitch
    },
    {
      name: 'Switch Table Data',
      setMethod: setIsSwitchTableSwitch,
      value: isSwitchTableSwitch
    },
    {
      name: 'Multiple Billing',
      setMethod: setIsMultipleBillingSwitch,
      value: isMultipleBillingSwitch
    },
    {
      name: 'Self Start',
      setMethod: setIsSelfStartSwitch,
      value: isSelfStartSwitch
    },
    {
      name: 'Break Game',
      setMethod: setIsBreakGameSwitch,
      value: isBreakGameSwitch
    }
  ]

  return (
    <Card>
      <CardHeader title='Store Control' />
      <form onSubmit={handleSubmit(() => onSubmit())}>
        <CardContent>
          <Grid container spacing={5} className='mbe-5'>
            {controlFields.map(field => (
              <>
                <Grid item key={field.name} xs={12} className='flex justify-between'>
                  <div className={`flex justify-start md:gap-4 gap-2 w-3/4`}>
                    <Typography className='flex font-medium w-fit items-center' color='text.primary'>
                      {field.name}
                    </Typography>
                  </div>
                  <div className={`flex justify-end md:gap-4 gap-2 w-3/4`}>
                    {isCancelGameSwitch && field.name === 'Cancel Game' ? (
                      <FormControl fullWidth size='small' className='md:w-32 w-24'>
                        <InputLabel id='cancel-min'>Minutes</InputLabel>
                        <Select
                          label='Minutes'
                          defaultValue='0'
                          value={cancelMinutes}
                          onChange={event => setCancelMinutes(event.target.value)}
                        >
                          {Array.from({ length: 11 }, (_, i) => i).map((id: number) => (
                            <MenuItem key={id} value={id}>
                              {id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <></>
                    )}

                    {isRequiredCustomerCountSwitch && field.name === 'Required Customer Count' ? (
                      <FormControl fullWidth size='small' className='md:w-32 w-24'>
                        <Select
                          defaultValue={1}
                          value={requiredCustomerCount}
                          onChange={event => setRequiredCustomerCount(event.target.value as number)}
                        >
                          {[1, 2].map((id: number) => (
                            <MenuItem key={id} value={id}>
                              {`${id} Customer`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <></>
                    )}
                    <FormControl>
                      <Switch size='medium' onChange={e => field.setMethod(e.target.checked)} checked={field.value} />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item className='w-full'>
                  <Divider />
                </Grid>
              </>
            ))}

            <Grid item xs={12}>
              <div className='flex justify-end'>
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

export default StoreControl
