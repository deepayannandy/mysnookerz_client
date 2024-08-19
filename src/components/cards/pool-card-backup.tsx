import { TableDataType } from '@/types/adminTypes'
import { getInitials } from '@/utils/getInitials'
import { Avatar, AvatarGroup, Button } from '@mui/material'
import CountUpTimer from '../count-up-timer'

const PoolCard = ({
  tableData,
  handleCheckout,
  handleStart,
  handleStop
}: {
  tableData: TableDataType
  handleCheckout: (value: TableDataType) => void
  handleStart: (value: TableDataType) => void
  handleStop: (value: TableDataType) => void
}) => {
  return (
    <div className='relative'>
      <img className='size-full rotate-180' src={'/images/snooker-table/Snooker_table.png'} alt='' />
      <div className='absolute flex flex-col justify-around items-center bottom-0 md:h-2/3 h-5/6 bg-gradient-to-t from-backdrop w-full rounded'>
        {/* <TextField
          label='Billing Type'
          defaultValue={billingType}
          InputProps={{
            readOnly: true
          }}
          variant='outlined'
        /> */}
        <h2 className='text-center text-sm my-2 text-white'>{tableData.tableName}</h2>

        {tableData.gameData?.gameType ? <h3 className=' text-sm text-white'>{tableData.gameData?.gameType}</h3> : <></>}

        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 28,
              height: 28,
              fontSize: 12,
              bgcolor: 'primary'
            }
          }}
        >
          {/* <Avatar key={customer.fullName} alt={customer.fullName} /> */}
          {tableData.gameData?.players?.map(customer => (
            <Avatar key={customer.fullName}>{getInitials(customer.fullName)}</Avatar>
          ))}
        </AvatarGroup>

        {tableData.gameData?.startTime ? (
          <CountUpTimer
            startTime={tableData.gameData?.startTime}
            endTime={tableData.gameData?.endTime}
            running={!!tableData.isOccupied && !tableData.gameData?.endTime}
          ></CountUpTimer>
        ) : (
          <></>
        )}

        {tableData.isOccupied ? (
          tableData.gameData?.endTime ? (
            <Button onClick={() => handleCheckout(tableData)} className='text-white outline-white py-0 md:my-12 my-4'>
              <span className='ri-bill-fill size-4'></span>
              Checkout
            </Button>
          ) : (
            <Button onClick={() => handleStop(tableData)} className='text-white outline-white py-0 md:my-12 my-4'>
              <span className='ri-stop-fill'></span>
              Stop
            </Button>
          )
        ) : (
          <Button onClick={() => handleStart(tableData)} className='text-white outline-white py-0 md:my-12 my-4'>
            <span className='ri-play-fill'></span>
            Start
          </Button>
        )}
      </div>
    </div>
  )
}

export default PoolCard
