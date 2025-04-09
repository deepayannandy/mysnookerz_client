import { StoreDataType, TableDataType } from '@/types/adminTypes'
import { CustomerInvoiceType, CustomerListType } from '@/types/staffTypes'
import { Autocomplete, Button, Chip, Divider, MenuItem, TextField, Tooltip } from '@mui/material'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CountdownTimer from '../count-down-timer'
import CountUpTimer from '../count-up-timer'
import BreakBill from '../dialogs/break-bill'
import OrderMeals from '../dialogs/order-meals'
import SwitchTable from '../dialogs/switch-table'
import TableBill from '../dialogs/table-bill'

const PoolCard = ({
  tableData,
  customersList,
  allTablesData,
  storeData,
  getAllTablesData,
  getCustomerData
}: {
  tableData: TableDataType
  customersList: CustomerListType[]
  allTablesData: TableDataType[]
  storeData: StoreDataType
  getAllTablesData: () => void
  getCustomerData: () => void
}) => {
  const gameTypes: string[] = tableData.gameData?.gameType ? tableData.gameTypes : []
  if (!tableData.gameData?.gameType) {
    tableData.gameTypes?.map(type => {
      if (type === 'Countdown Billing') {
        tableData.countdownRules?.map(rule => {
          gameTypes.push(`Countdown Billing (${rule.uptoMin} mins)`)
        })
      } else {
        gameTypes.push(type)
      }
    })
  }

  const [showBill, setShowBill] = useState(false)
  const [gameType, setGameType] = useState(tableData.gameData?.gameType || gameTypes[0])
  const [customers, setCustomers] = useState(
    (tableData.gameData?.players?.length ? tableData.gameData.players : []) as (string | CustomerListType)[]
  )
  const [billData, setBillData] = useState({} as CustomerInvoiceType)
  const [showSwitchTable, setShowSwitchTable] = useState(false)
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false)
  const [showMealCart, setShowMealCart] = useState(false)
  const [showOnHoldBill, setShowOnHoldBill] = useState(false)
  const [isHoldButtonDisabled, setIsHoldButtonDisabled] = useState(false)
  const [showBreakBill, setShowBreakBill] = useState(false)
  // let totalSeconds =
  //   tableData.gameData?.startTime && tableData.gameData?.endTime
  //     ? DateTime.fromISO(tableData.gameData.endTime).diff(DateTime.fromISO(tableData.gameData.startTime), ['seconds'])
  //         .seconds
  //     : 0

  // if (tableData?.pauseMin) {
  //   totalSeconds = totalSeconds - tableData.pauseMin * 60
  // }

  // const totalMinutes = Math.ceil(totalSeconds / 60)

  // Now break down total minutes into hours and minutes
  // const hours = Math.floor(totalMinutes / 60) // full hours
  // const minutes = totalMinutes % 60

  const getBillData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    if (tableData._id) {
      try {
        const response = await axios.get(`${apiBaseUrl}/games/getBilling/${tableData._id}`, {
          headers: { 'auth-token': token }
        })
        if (response && response.data) {
          setBillData(response.data)
        }
      } catch (error: any) {
        // if (error?.response?.status === 409) {
        //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        //   return router.replace(redirectUrl)
        // }
        toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      }
    }
  }

  useEffect(() => {
    if (tableData.gameData?.endTime && tableData.isOccupied) {
      getBillData()
    }

    setCustomers(
      (tableData.gameData?.players?.length ? tableData.gameData.players : []) as (string | CustomerListType)[]
    )
    setGameType(tableData.gameData?.gameType || gameTypes[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData])

  const validatePlayers = async (
    players: (CustomerListType | { fullName: string })[],
    gameType: string
  ): Promise<{ success: boolean }> => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/validatePlayers/${tableData._id}`,
        { gameType, players },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        return { success: true }
      }
      return { success: false }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      return { success: false }
    }
  }

  const startGame = async () => {
    setIsStartButtonDisabled(true)
    setTimeout(() => setIsStartButtonDisabled(false), 5000)

    let players = customers.map(customer => {
      if (typeof customer === 'string') {
        return { fullName: customer }
      }
      return customer
    })

    if (!players.length) {
      players = [{ fullName: 'CASH' }]
    }

    let countdownTime = {}
    let selectedGameType = gameType
    if (gameType.startsWith('Countdown')) {
      selectedGameType = 'Countdown Billing'
      const min = gameType.split('(')?.[1].split(' ')?.[0]
      countdownTime = { countdownMin: min }
    }

    const playersValidation = await validatePlayers(players, selectedGameType)
    if (!playersValidation?.success) {
      return
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/startGame/${tableData._id}`,
        { gameType: selectedGameType, players, ...countdownTime },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        toast.success(`${tableData.tableName} started`, { icon: <>😁</> })
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

  const stopGame = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/games/stopGame/${tableData._id}`,
        {},
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getBillData()
        getAllTablesData()
        toast.success(`${tableData.tableName} stopped`)
      }
    } catch (error: any) {
      if (error?.response?.status === 422) {
        getAllTablesData()
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const breakGame = async () => {
    if (tableData?.isBreakHold) {
      setShowBreakBill(true)
      return
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/break/${tableData._id}`,
        {},
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        setShowBreakBill(true)
        getAllTablesData()
        // toast.success(`${tableData.tableName} stopped`)
      }
    } catch (error: any) {
      if (error?.response?.status === 422) {
        getAllTablesData()
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const pauseGame = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/pause/${tableData._id}`,
        {},
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        toast.success(`${tableData.tableName} paused`)
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

  const resumeGame = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/resume/${tableData._id}`,
        {},
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        toast.success(`${tableData.tableName} resumed`)
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

  const restartGame = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/restart/${tableData._id}`,
        {},
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        toast.success(`${tableData.tableName} restarted`)
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

  const holdCheckout = async () => {
    setIsHoldButtonDisabled(true)
    setTimeout(() => setIsHoldButtonDisabled(false), 3000)

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(`${apiBaseUrl}/games/putOnHold/${tableData._id}`, billData, {
        headers: { 'auth-token': token }
      })

      if (response && response.data) {
        setGameType(tableData.gameTypes[0] || '')
        setCustomers(['CASH'])
        getAllTablesData()
        toast.success('Good Job!', { icon: <>👏</> })
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <div className='relative'>
      <img src='/images/snooker-table/snooker-table-updated.svg' className='size-full' alt='' />

      <div
        className={`absolute w-full h-full top-0 flex flex-col justify-between p-6 ${!tableData.gameData?.startTime ? 'bg-backdrop rounded-t-[22px] rounded-b-[16px]' : ''}`}
      >
        <div className='grid place-items-center'>
          <div className='bg-[url("/images/snooker-table/background-trapezoid.svg")] flex justify-center gap-3 bg-contain text-black bg-no-repeat bg-center w-full lg:w-11/12'>
            {tableData?.isHold ? (
              <Tooltip title='Checkout Pending' placement='top' className='cursor-pointer text-xl text-center pt-6'>
                <span
                  className='ri-bill-line'
                  onClick={() => {
                    setShowOnHoldBill(true)
                    setShowBill(true)
                  }}
                ></span>
              </Tooltip>
            ) : tableData?.gameData?.gameType !== 'Countdown Billing' ? (
              !tableData?.isBreakHold && tableData?.gameData?.endTime ? (
                <Tooltip title='Restart Table' placement='top' className='cursor-pointer text-xl text-center pt-6'>
                  <span className='ri-restart-line' onClick={restartGame}></span>
                </Tooltip>
              ) : storeData.StoreData?.isSwitchTable ? (
                <Tooltip title='Switch Table' placement='top' className='cursor-pointer text-xl text-center pt-6'>
                  <span className='ri-arrow-left-right-line' onClick={() => setShowSwitchTable(true)}></span>
                </Tooltip>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            <Tooltip title={tableData.tableName} placement='top' className='cursor-pointer'>
              <span
                className={`text-base line-clamp-1 w-24 col-span-2 ${tableData?.gameData?.gameType !== 'Countdown Billing' ? 'pl-3' : 'text-center'}`}
              >
                {tableData.tableName}
              </span>
            </Tooltip>
          </div>

          <TextField
            className='w-full text-xs bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'
            disabled={!!tableData.gameData?.startTime}
            size='small'
            color='error'
            value={gameType}
            onChange={e => setGameType(e.target.value)}
            select // tell TextField to render select
            placeholder='Billing'
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiInputLabel-root.Mui-disabled': {
                color: '#FFFFFF'
              },
              '& .MuiInputLabel-outlined': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF'
                }
              },
              '& .MuiOutlinedInput-root': {
                color: 'white'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#adb5bd'
              }
            }}
          >
            {gameTypes?.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <Tooltip
            title={customers
              .map(name => {
                if (typeof name === 'string') {
                  return name
                }
                return name.fullName
              })
              .join(',')}
          >
            <Autocomplete
              disabled={!!tableData.gameData?.startTime}
              size='small'
              className='w-full text-xs bg-green-900 mt-1 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'
              limitTags={1}
              multiple
              sx={{
                // '& .MuiOutlinedInput-root': {
                //   // border: "1px solid yellow",
                //   borderRadius: '4px'
                // },
                '& .MuiAutocomplete-paper': {
                  overflowY: 'auto' // Ensure the dropdown becomes scrollable
                },
                // '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                //   borderColor: '#0FED11',
                //   borderWidth: '1px'
                // },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: '#FFFFFF'
                },
                '& .MuiInputLabel-outlined': {
                  color: '#FFFFFF',
                  '&.Mui-focused': {
                    color: '#FFFFFF'
                  }
                },
                '& .MuiInputBase-root-MuiOutlinedInput-root': {
                  color: 'white'
                },
                '& .MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled': {
                  color: 'white'
                },
                '& .MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
                  WebkitTextFillColor: '#F5F7F8'
                },
                '& .MuiAutocomplete-tag': {
                  color: 'white'
                }
              }}
              options={customersList}
              getOptionLabel={option => ((option as CustomerListType)?.fullName ?? option)?.split('(').join(' (')}
              getOptionKey={option => (option as CustomerListType).customerId}
              freeSolo
              value={customers}
              onChange={(_, value) => {
                setCustomers(value)
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index })
                  return (
                    <Chip
                      size='small'
                      variant='outlined'
                      label={(option as CustomerListType)?.fullName ?? option}
                      {...tagProps}
                      key={key}
                      sx={{
                        borderColor: 'white',
                        '& .MuiAvatar-root': {
                          margin: '4px 0px'
                        },
                        '& .MuiChip-label': {
                          textAlign: 'center',
                          maxWidth: '111px',
                          height: '20px',
                          color: 'white'
                        },
                        '& .MuiChip-deleteIcon': {
                          color: 'white' // Customize the cancel button color
                        }
                        // '& .MuiButtonBase-root.Mui-disabled': {
                        //   opacity: 1,
                        //   backgroundColor: 'red'
                        // }
                      }}
                    />
                  )
                })
              }
              renderInput={params => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    enterKeyHint: 'enter'
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      ...(tableData.gameData?.startTime ? {} : { height: '60px' }), // Set the fixed height for the TextField
                      overflowY: 'auto',
                      border: 'none',
                      color: 'white'
                    },
                    fieldset: {
                      border: 'none'
                    }
                  }}
                  variant='outlined'
                  placeholder='Customers'
                />
              )}
            />
          </Tooltip>

          {tableData.gameData?.startTime ? (
            <div className='w-full grid grid-cols-2 gap-2 text-white border border-[#0FED11] px-4 py-2 bg-green-900 mt-1 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
              {tableData.gameData?.startTime ? (
                <p className='text-[10px]'>
                  Start Time
                  <br />
                  <span className='font-bold text-xs'>
                    {DateTime.fromISO(tableData.gameData.startTime).toFormat('hh:mm:ss a')}
                  </span>
                </p>
              ) : (
                <></>
              )}

              {!tableData.isBreakHold && tableData.gameData?.endTime ? (
                <p className='text-[10px]'>
                  End Time
                  <br />
                  <span className='font-bold text-xs'>
                    {DateTime.fromISO(tableData.gameData.endTime).toFormat('hh:mm:ss a')}
                  </span>
                </p>
              ) : (
                <></>
              )}

              {tableData.gameData?.startTime && tableData.gameData?.endTime && !tableData.isBreakHold ? (
                <>
                  <Divider className='col-span-2' />
                  <p className='text-xs'>Total Time</p>
                  <p className='text-xs'>
                    {Math.floor(billData.timeDelta / 60) || '00'}hrs {billData.timeDelta % 60 || '00'}mins
                  </p>
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {tableData.gameData?.startTime && !tableData.gameData?.endTime ? (
            <div className='w-full grid grid-cols-1 gap-2 place-items-center text-white border border-[#0FED11] px-4 py-2 bg-green-900 mt-1 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
              {tableData.gameData?.countdownMin ? (
                <CountdownTimer
                  startTime={tableData.gameData?.startTime}
                  endTime={tableData.gameData?.endTime}
                  pauseTime={tableData?.pauseTime}
                  pauseMinute={tableData?.pauseMin}
                  countdownMin={tableData.gameData?.countdownMin}
                  running={!!tableData.isOccupied && !tableData.gameData?.endTime && !tableData?.pauseTime}
                  getAllTablesData={getAllTablesData}
                ></CountdownTimer>
              ) : (
                <CountUpTimer
                  startTime={tableData.gameData?.startTime}
                  endTime={tableData.gameData?.endTime}
                  pauseTime={tableData?.pauseTime}
                  pauseMinute={tableData?.pauseMin}
                  running={!!tableData.isOccupied && !tableData.gameData?.endTime && !tableData?.pauseTime}
                ></CountUpTimer>
              )}
            </div>
          ) : (
            <></>
          )}
          {/* <div className='w-full grid grid-cols-2 gap-2 border border-[#0FED11] px-4 py-2  bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
            <p className='text-xs'>Amount</p>
            <p className='text-xs'>400</p>
          </div> */}
          {!tableData.isBreakHold && tableData.gameData?.endTime && tableData.isOccupied ? (
            <>
              <div className='w-full grid grid-cols-2 gap-2 text-white border border-[#0FED11] px-4 py-2 bg-green-900 mt-1 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
                <p className='text-xs'>Table Amount</p>
                <p className='text-xs'>{`₹${billData.totalBillAmt || 0}`}</p>
                <Divider className='col-span-2' />
                <p className='text-xs'>Meals Amount</p>
                <p className='text-xs'>{`₹${billData.mealTotal || 0}`}</p>
              </div>
              <div className='w-full bg-[#E73434] grid grid-cols-2 gap-2 text-white border border-white px-4 py-1 mt-1 shadow-[0.5px_0.5px_6px_1px_white] rounded-lg'>
                <p className='text-[14px]'>Net Pay</p>
                <p className='text-[14px]'>{`₹${Number(billData.totalBillAmt || 0) + Number(billData.mealTotal || 0)}`}</p>
              </div>
            </>
          ) : (
            <></>
          )}
          {/* <div className='w-full grid grid-cols-2 gap-2 border border-[#0FED11] px-2 py-1 md:px-4 md:py-2  bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
            <TextField
              size='small'
              id='outlined-start-adornment'
              placeholder='$_._'
              InputProps={{
                startAdornment: <p className='text-xs mr-1'>Disc</p>
              }}
            />
            <TextField
              size='small'
              id='outlined-start-adornment'
              placeholder='$_._'
              InputProps={{
                startAdornment: <p className='text-xs mr-1'>Net Pay</p>
              }}
            />
            <TextField
              size='small'
              id='outlined-start-adornment'
              placeholder='$_._'
              InputProps={{
                startAdornment: <p className='text-xs mr-1'>Paid</p>
              }}
            />
            <TextField
              size='small'
              id='outlined-start-adornment'
              placeholder='$_._'
              InputProps={{
                startAdornment: <p className='text-xs mr-1'>Cash</p>
              }}
            />
          </div> */}
        </div>

        <div className='grid gap-y-1 mb-3'>
          {tableData.isOccupied ? (
            !tableData.isBreakHold && tableData.gameData?.endTime ? (
              <>
                {storeData?.StoreData?.isHoldEnable ? (
                  <Button
                    variant='contained'
                    disabled={isHoldButtonDisabled || tableData.isHold}
                    className='bg-white text-black h-6'
                    onClick={() => holdCheckout()}
                  >
                    <span className='ri-bar-chart-box-fill text-base mr-1'></span>Hold
                  </Button>
                ) : (
                  <></>
                )}
                <Button variant='contained' className='bg-[#FFCA00] text-black h-6' onClick={() => setShowBill(true)}>
                  <span className='ri-bank-card-fill text-base -rotate-45 mr-1'></span>Checkout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='contained'
                  className='bg-[#2E2E2E] text-white h-8'
                  onClick={() => setShowMealCart(true)}
                >
                  <span className='ri-restaurant-2-fill text-base'></span>
                  Add Meals
                </Button>
                {storeData?.StoreData?.isPauseResume ? (
                  tableData?.pauseTime ? (
                    <Button variant='contained' className='bg-[#FFCA00] text-black h-8' onClick={resumeGame}>
                      <span className='ri-play-mini-fill'></span>Resume
                    </Button>
                  ) : (
                    <Button variant='contained' className='bg-[#FFCA00] text-black h-8' onClick={pauseGame}>
                      <span className='ri-pause-mini-fill'></span>Pause
                    </Button>
                  )
                ) : (
                  <></>
                )}
                {['Minute Billing', 'Slot Billing'].includes(gameType) && tableData.isBreakGame ? (
                  <Button variant='contained' className='bg-[#E73434] text-white h-8' onClick={breakGame}>
                    <span className='ri-file-damage-fill'></span>
                    {`${tableData.isBreakHold ? 'Resume' : 'Break'}`}
                  </Button>
                ) : (
                  <Button variant='contained' className='bg-[#E73434] text-white h-8' onClick={stopGame}>
                    <span className='ri-stop-mini-fill'></span>Stop
                  </Button>
                )}
              </>
            )
          ) : (
            <Button
              disabled={isStartButtonDisabled}
              variant='contained'
              className='bg-white text-black h-8'
              onClick={startGame}
            >
              <span className='ri-play-mini-fill' />
              Start
            </Button>
          )}
        </div>
      </div>
      {/* <div
        className='background-image-snooker-table bg-cover bg-no-repeat min-h-96 min-w-48'
        style={{ backgroundImage: 'url(' + '/images/snooker-table/snooker-table-updated.svg' + ')' }}
      ></div> */}
      {showBill ? (
        <TableBill
          open={showBill}
          setOpen={setShowBill}
          isOnHoldBill={showOnHoldBill}
          setShowOnHoldBill={setShowOnHoldBill}
          tableData={tableData}
          customersList={customersList}
          getAllTablesData={getAllTablesData}
          setGameType={setGameType}
          setCustomers={setCustomers}
          getCustomerData={getCustomerData}
        />
      ) : (
        <></>
      )}
      {showBreakBill ? (
        <BreakBill
          open={showBreakBill}
          setOpen={setShowBreakBill}
          tableData={tableData}
          customersList={customersList}
          getAllTablesData={getAllTablesData}
          getCustomerData={getCustomerData}
        />
      ) : (
        <></>
      )}
      {showMealCart ? (
        <OrderMeals
          open={showMealCart}
          setOpen={setShowMealCart}
          tableData={tableData}
          getAllTablesData={getAllTablesData}
        />
      ) : (
        <></>
      )}
      {showSwitchTable ? (
        <SwitchTable
          open={showSwitchTable}
          setOpen={setShowSwitchTable}
          tableData={tableData}
          allTablesData={allTablesData}
          getAllTablesData={getAllTablesData}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default PoolCard
