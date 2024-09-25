import { TableDataType } from '@/types/adminTypes'
import { CustomerInvoiceType, CustomerListType } from '@/types/staffTypes'
import { Autocomplete, Button, Chip, Divider, MenuItem, TextField, Tooltip } from '@mui/material'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CountUpTimer from '../count-up-timer'
import SwitchTable from '../dialogs/switch-table'
import TableBill from '../dialogs/table-bill'

const PoolCard = ({
  tableData,
  customersList,
  allTablesData,
  getAllTablesData
}: {
  tableData: TableDataType
  customersList: CustomerListType[]
  allTablesData: TableDataType[]
  getAllTablesData: () => void
}) => {
  const [showBill, setShowBill] = useState(false)
  const [gameType, setGameType] = useState(tableData.gameData?.gameType || tableData.gameTypes[0])
  const [customers, setCustomers] = useState(
    (tableData.gameData?.players?.length ? tableData.gameData.players : ['CASH']) as (string | CustomerListType)[]
  )
  const [billData, setBillData] = useState({} as CustomerInvoiceType)
  const [showSwitchTable, setShowSwitchTable] = useState(false)

  let totalSeconds =
    tableData.gameData?.startTime && tableData.gameData?.endTime
      ? DateTime.fromISO(tableData.gameData.endTime).diff(DateTime.fromISO(tableData.gameData.startTime), ['seconds'])
          .seconds
      : 0

  if (tableData?.pauseMin) {
    totalSeconds = totalSeconds - tableData.pauseMin * 60
  }

  const totalMinutes = Math.ceil(totalSeconds / 60)

  // Now break down total minutes into hours and minutes
  const hours = Math.floor(totalMinutes / 60) // full hours
  const minutes = totalMinutes % 60

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
        // if (error?.response?.status === 400) {
        //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        //   return router.replace(redirectUrl)
        // }
        toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      }
    }
  }

  useEffect(() => {
    if (tableData.gameData?.endTime) {
      getBillData()
    }

    setCustomers(
      (tableData.gameData?.players?.length ? tableData.gameData.players : ['CASH']) as (string | CustomerListType)[]
    )
    setGameType(tableData.gameData?.gameType || tableData.gameTypes[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData])

  const startGame = async () => {
    const players = customers.map(customer => {
      if (typeof customer === 'string') {
        return { fullName: customer }
      }
      return customer
    })

    if (!players.length) {
      toast.error('Please add at least one customer name')
      return
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/startGame/${tableData._id}`,
        { gameType: gameType, players },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        toast.success(`${tableData.tableName} started`, { icon: <>😁</> })
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
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
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
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
      // if (error?.response?.status === 400) {
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
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }
  return (
    <div className='relative'>
      <img src='/images/snooker-table/snooker-table-updated.svg' className='size-full' alt='' />

      <div
        className={`absolute w-full h-full top-0 flex flex-col justify-between p-8 ${!tableData.gameData?.startTime ? 'bg-backdrop rounded-t-[22px] rounded-b-[16px]' : ''}`}
      >
        <div className='grid place-items-center'>
          <div className='bg-[url("/images/snooker-table/background-trapezoid.svg")] flex justify-center gap-3 bg-contain text-black bg-no-repeat bg-center w-full lg:w-11/12'>
            <Tooltip title='Switch Table' placement='top' className='cursor-pointer text-xl text-center pt-6'>
              <span className='ri-arrow-left-right-line' onClick={() => setShowSwitchTable(true)}></span>
            </Tooltip>
            <Tooltip title={tableData.tableName} placement='top' className='cursor-pointer'>
              <span className='text-base line-clamp-1 w-24 col-span-2 pl-3'>{tableData.tableName}</span>
            </Tooltip>
          </div>

          <TextField
            className='w-full text-xs bg-green-900 md:mt-2 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'
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
            {tableData.gameTypes?.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            disabled={!!tableData.gameData?.startTime}
            size='small'
            className='w-full text-xs bg-green-900 md:mt-2 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'
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
            getOptionLabel={option => ((option as CustomerListType).fullName ?? option)?.split('(').join(' (')}
            freeSolo
            value={customers}
            onChange={(_, value) => setCustomers(value)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })
                return (
                  <Chip
                    size='small'
                    variant='outlined'
                    label={(option as CustomerListType).fullName ?? option}
                    {...tagProps}
                    key={key}
                    sx={{
                      borderColor: 'white',
                      '& .MuiAvatar-root': {
                        margin: '4px 0px'
                      },
                      '& .MuiChip-label': {
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        textOverflow: 'clip',
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
          {/* {tableData.gameData?.players?.length ? (
            <div className='w-full grid grid-cols-2 gap-2 border border-[#0FED11] px-4 py-2 bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
              <p>Customers</p>
              <p>{`${tableData.gameData?.players[0]?.fullName} +${tableData.gameData?.players?.length - 1}`}</p>
            </div>
          ) : (
            <Autocomplete
              disabled={!!tableData.gameData?.startTime}
              size='small'
              className='w-full border-[#0FED11] text-xs bg-green-900 md:mt-2 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'
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
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0FED11',
                  borderWidth: '1px'
                },
                '& .MuiInputLabel-outlined': {
                  color: '#0FED11',
                  '&.Mui-focused': {
                    color: '#0FED11'
                  }
                }
              }}
              options={customersList}
              getOptionLabel={option => (option as CustomerListType).fullName ?? option}
              freeSolo
              value={customers}
              onChange={(_, value) => setCustomers(value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index })
                  return (
                    <Chip
                      size='small'
                      variant='outlined'
                      label={(option as CustomerListType).fullName ?? option}
                      {...tagProps}
                      key={key}
                      sx={{
                        '& .MuiAvatar-root': {
                          margin: '4px 0px'
                        },
                        '& .MuiChip-label': {
                          wordWrap: 'break-word',
                          whiteSpace: 'normal',
                          textOverflow: 'clip',
                          textAlign: 'center',
                          maxWidth: '111px',
                          height: '20px'
                        }
                      }}
                    />
                  )
                })
              }
              renderInput={params => (
                <TextField
                  {...params}
                  sx={{
                    '& .MuiInputBase-root': {
                      ...(tableData.gameData?.startTime ? {} : { height: '60px' }), // Set the fixed height for the TextField
                      overflowY: 'auto',
                      border: 'none'
                    },
                    fieldset: {
                      border: 'none'
                    }
                  }}
                  variant='outlined'
                  label='Customers'
                  placeholder='Customers'
                />
              )}
            />
          )} */}

          {tableData.gameData?.startTime ? (
            <div className='w-full grid grid-cols-2 gap-2 text-white border border-[#0FED11] px-4 py-2 bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
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

              {tableData.gameData?.endTime ? (
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

              {tableData.gameData?.startTime && tableData.gameData?.endTime ? (
                <>
                  <Divider className='col-span-2' />
                  <p className='text-xs'>Total Time</p>
                  <p className='text-xs'>
                    {hours || '00'}hrs {minutes || '00'}mins
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
            <div className='w-full grid grid-cols-1 gap-2 place-items-center text-white border border-[#0FED11] px-4 py-2 bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
              <CountUpTimer
                startTime={tableData.gameData?.startTime}
                endTime={tableData.gameData?.endTime}
                pauseTime={tableData?.pauseTime}
                pauseMinute={tableData?.pauseMin}
                running={!!tableData.isOccupied && !tableData.gameData?.endTime && !tableData?.pauseTime}
              ></CountUpTimer>
            </div>
          ) : (
            <></>
          )}
          {/* <div className='w-full grid grid-cols-2 gap-2 border border-[#0FED11] px-4 py-2  bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
            <p className='text-xs'>Amount</p>
            <p className='text-xs'>400</p>
          </div> */}
          {tableData.gameData?.endTime ? (
            <>
              <div className='w-full grid grid-cols-2 gap-2 text-white border border-[#0FED11] px-4 py-2 bg-green-900 mt-2 shadow-[0.5px_0.5px_6px_1px_#0FED11] rounded-lg'>
                <p className='text-xs'>Table Amount</p>
                <p className='text-xs'>{`₹${billData.totalBillAmt || 0}`}</p>
                <Divider className='col-span-2' />
                <p className='text-xs'>Meals Amount</p>
                <p className='text-xs'>{`₹${billData.mealAmount || 0}`}</p>
              </div>
              <div className='w-full bg-[#E73434] grid grid-cols-2 gap-2 text-white border border-white px-4 py-2 mt-2 shadow-[0.5px_0.5px_6px_1px_white] rounded-lg'>
                <p className='text-[14px]'>Net Pay</p>
                <p className='text-[14px]'>{`₹${billData.totalBillAmt || 0}`}</p>
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

        <div className='grid gap-y-2 mb-6'>
          {tableData.isOccupied ? (
            tableData.gameData?.endTime ? (
              <Button variant='contained' className='bg-[#FFCA00] text-black h-8' onClick={() => setShowBill(true)}>
                <span className='ri-bank-card-fill text-base -rotate-45 mr-1'></span>Checkout
              </Button>
            ) : (
              <>
                <Button variant='contained' className='bg-[#2E2E2E] text-white  h-8'>
                  <span className='ri-restaurant-2-fill text-base'></span>
                  Add Meals
                </Button>
                {tableData?.pauseTime ? (
                  <Button variant='contained' className='bg-[#FFCA00] text-black h-8' onClick={resumeGame}>
                    <span className='ri-play-mini-fill'></span>Resume
                  </Button>
                ) : (
                  <Button variant='contained' className='bg-[#FFCA00] text-black h-8' onClick={pauseGame}>
                    <span className='ri-pause-mini-fill'></span>Pause
                  </Button>
                )}
                <Button variant='contained' className='bg-[#E73434] text-white h-8' onClick={stopGame}>
                  <span className='ri-stop-mini-fill'></span>Stop
                </Button>
              </>
            )
          ) : (
            <Button variant='contained' className='bg-white text-black h-8' onClick={startGame}>
              <span className='ri-play-mini-fill'></span>
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
          tableData={tableData}
          getAllTablesData={getAllTablesData}
          setGameType={setGameType}
          setCustomers={setCustomers}
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
