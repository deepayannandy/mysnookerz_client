'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Style Imports
import BaseSwitch from '@/components/BaseSwitch'
import '@/libs/styles/tiptapEditor.css'
import { StoreDataType } from '@/types/adminTypes'
import { Button, Divider, FormControl, MenuItem, Select, Typography } from '@mui/material'
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
  const [isHoldCheckoutSwitch, setIsHoldCheckoutSwitch] = useState(true)
  // const [isMultipleBillingSwitch, setIsMultipleBillingSwitch] = useState(true)
  const [isSelfStartSwitch, setIsSelfStartSwitch] = useState(true)
  // const [isBreakSwitch, setisBreakSwitch] = useState(true)
  const [cancelMinutes, setCancelMinutes] = useState(1)

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
    setIsBillPrintSwitch(!!storeData?.StoreData?.isPrintEnable)
    setIsPrepaidModeSwitch(!!storeData?.StoreData?.isPrepaidMode)
    setIsRoundOffSwitch(!!storeData?.StoreData?.isRoundOff)
    setIsSwitchTableSwitch(!!storeData?.StoreData?.isSwitchTable)
    // setIsMultipleBillingSwitch(!!storeData?.StoreData?.isMultipleBilling)
    setIsSelfStartSwitch(!!storeData?.StoreData?.isSelfStart)
    // setIsBreakSwitch(!!storeData?.StoreData?.isBreak)
    setCancelMinutes(storeData?.StoreData?.cancelMins ?? 1)
    setIsHoldCheckoutSwitch(!!storeData?.StoreData?.isHoldEnable)
  }, [storeData])

  const onSubmit = async () => {
    const requestData = {
      requiredCustomerCount,
      isCancel: isCancelGameSwitch,
      isPauseResume: isPauseAndResumeSwitch,
      isRoundOff: isRoundOffSwitch,
      isPrintEnable: isBillPrintSwitch,
      isPrepaidMode: isPrepaidModeSwitch,
      isSwitchTable: isSwitchTableSwitch,
      // isMultipleBilling: isMultipleBillingSwitch,
      isSelfStart: isSelfStartSwitch,
      // isBreak: isBreakSwitch,
      cancelMins: isCancelGameSwitch ? cancelMinutes : 0,
      isHoldEnable: isHoldCheckoutSwitch
    }

    if (!isRequiredCustomerCountSwitch) {
      requestData.requiredCustomerCount = 0
    }

    if (!isCancelGameSwitch) {
      requestData.cancelMins = 0
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

  const handleCancelMinuteSwitch = (value: boolean) => {
    if (value) {
      setIsCancelGameSwitch(true)
      setCancelMinutes(1)
    } else {
      setIsCancelGameSwitch(false)
      setCancelMinutes(0)
    }
  }

  const controlFields = [
    {
      name: 'Required Customer Name',
      caption: 'Once enabled, the selected number of customer names must be filled in to start the table.',
      setMethod: handleIsRequiredCustomerCountSwitch,
      value: isRequiredCustomerCountSwitch
    },
    {
      name: 'Game Cancellation Timeout',
      caption: 'Once enabled, the game will automatically cancel if the customer exits within the set time limit.',
      setMethod: handleCancelMinuteSwitch,
      value: isCancelGameSwitch
    },
    {
      name: 'Pause Resume Billing Timer',
      caption: 'Pauses the timer, and the paused time is not counted in the total billing amount.',
      setMethod: setIsPauseAndResumeSwitch,
      value: isPauseAndResumeSwitch
    },
    {
      name: 'Pay First, Play Next',
      caption: 'Enabling this starts the game after the advance amount has been paid.',
      setMethod: setIsPrepaidModeSwitch,
      value: isPrepaidModeSwitch
    },
    {
      name: 'Transfer Table',
      caption: 'Transfers the current customer playing at one table to another table.',
      setMethod: setIsSwitchTableSwitch,
      value: isSwitchTableSwitch
    },
    {
      name: 'Enabling this rounds off the amount based on the selected type:',
      caption: `Type 1: Rounds to the nearest whole number (e.g., 20.50 or 20.60 becomes 21, 20.40 becomes 20).`,
      captionTwo: `Type 2: Rounds to the nearest 5 (e.g., 23 becomes 25, 22 becomes 20).`,
      setMethod: setIsRoundOffSwitch,
      value: isRoundOffSwitch
    },
    {
      name: 'Print Receipt',
      caption: 'Prints a copy of the bill.',
      setMethod: setIsBillPrintSwitch,
      value: isBillPrintSwitch
    },
    {
      name: 'Hold Checkout',
      caption: 'Temporarily reserves an checkout for a customer, allowing them to finalize the purchase later.',
      setMethod: setIsHoldCheckoutSwitch,
      value: isHoldCheckoutSwitch
    },
    // {
    //   name: 'Multiple Billing',
    //   caption: '',
    //   setMethod: setIsMultipleBillingSwitch,
    //   value: isMultipleBillingSwitch
    // },
    {
      name: 'Self Start',
      caption: '',
      setMethod: setIsSelfStartSwitch,
      value: isSelfStartSwitch
    }
    // {
    //   name: 'Break Game',
    //   caption: '',
    //   setMethod: setisBreakSwitch,
    //   value: isBreakSwitch
    // }
  ]

  return (
    <>
      <form onSubmit={handleSubmit(() => onSubmit())}>
        <div className='flex justify-between'>
          <Typography variant='h4' className='mb-4 font-bold'>
            Store Control
          </Typography>
          <Button variant='text' type='submit' className='border-0 text-base cursor-pointer mb-2'>
            Save Settings
          </Button>
        </div>
        <Card>
          <CardContent>
            <Grid container spacing={5} className='mbe-5'>
              {/* <Grid item className='w-full pt-2'>
                <Divider />
              </Grid> */}
              {controlFields.map(field => (
                <>
                  <Grid item key={field.name} xs={12} className='flex md:flex-row flex-col md:justify-between gap-3'>
                    <div className={`flex flex-col justify-start w-full`}>
                      <Typography
                        className='flex w-fit items-center font-semibold text-base lg:text-[18px] leading-[21.09px] mb-[5px]'
                        color='text.primary'
                      >
                        {field.name}
                      </Typography>
                      {field.captionTwo ? (
                        <ul className='list-disc pl-5 space-y-1 w-full'>
                          <li>{field.caption}</li>
                          <li>{field.captionTwo}</li>
                        </ul>
                      ) : (
                        <Typography
                          className='flex w-full items-center text-sm lg:text-[16px] leading-[21.09px] font-normal'
                          color='text.primary.light'
                        >
                          {field.caption}
                        </Typography>
                      )}
                    </div>
                    <div className={`flex md:justify-end justify-start md:gap-4 gap-2 w-full`}>
                      {isCancelGameSwitch && field.name === 'Game Cancellation Timeout' ? (
                        <FormControl fullWidth size='small' className='w-32'>
                          <Select
                            defaultValue={1}
                            value={cancelMinutes}
                            onChange={event => setCancelMinutes(event.target.value as number)}
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((id: number) => (
                              <MenuItem key={id} value={id}>
                                {`${id} ${id === 1 ? 'Minute' : 'Minutes'}`}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <></>
                      )}

                      {isRequiredCustomerCountSwitch && field.name === 'Required Customer Name' ? (
                        <FormControl fullWidth size='small' className='w-32'>
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
                        <BaseSwitch onChange={field.setMethod} value={field.value} />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item className='w-full pt-2'>
                    <Divider />
                  </Grid>
                </>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </form>
    </>
  )
}

export default StoreControl
