'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// Style Imports
import '@/libs/styles/tiptapEditor.css'
import { StoreDataType } from '@/types/adminTypes'
import { FormControl, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const StoreControl = ({ storeData, getStoreData }: { storeData: StoreDataType; getStoreData: () => void }) => {
  const [isDefaultCustomerSwitch, setIsDefaultCustomerSwitch] = useState(true)
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
    setIsDefaultCustomerSwitch(!!storeData?.StoreData?.defaultCustomer)
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
      defaultCustomer: isDefaultCustomerSwitch,
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

  const controlFields = [
    {
      name: 'Default Customer',
      setMethod: setIsDefaultCustomerSwitch,
      value: isDefaultCustomerSwitch
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
      <CardHeader title='Control' />
      <form onSubmit={handleSubmit(() => onSubmit())}>
        <CardContent>
          <Grid container spacing={5} className='mbe-5'>
            {controlFields.map(field => (
              <Grid item key={field.name} xs={12} className='flex w-full justify-between'>
                <Typography className='flex font-medium w-fit items-center' color='text.primary'>
                  {field.name}
                </Typography>
                <FormControl>
                  <Switch onChange={e => field.setMethod(e.target.checked)} checked={field.value} />
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12}>
              <div className='flex justify-end gap-4'>
                {isCancelGameSwitch ? (
                  <FormControl fullWidth size='small' className='w-32'>
                    <InputLabel id='cancel-min'>Cancel Minutes</InputLabel>
                    <Select
                      label='Cancel Minutes'
                      defaultValue='Standard'
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
