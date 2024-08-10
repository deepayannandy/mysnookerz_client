import { Avatar, AvatarGroup, Button, TextField } from '@mui/material'
import CountUpTimer from '../count-up-timer'

const PoolCard = ({
  avatars,
  timer,
  tableName,
  billingType,
  isTableActive,
  startTable,
  handleCheckout,
  handleStart,
  handleStop
}: {
  avatars: string[]
  timer: string
  tableName: string
  billingType: string
  isTableActive: boolean
  startTable: boolean
  handleCheckout: (tableName: string) => void
  handleStart: (tableName: string) => void
  handleStop: (tableName: string) => void
}) => {
  return (
    <div className='relative'>
      <img className='size-full rotate-180' src={'/images/snooker-table/Snooker_table.png'} alt='' />
      <div className='absolute flex flex-col justify-end items-center bottom-0 h-2/3 bg-gradient-to-t from-backdrop w-full rounded px-6'>
        {/* <TextField className='text-white' disabled label='Billing Type' value={billingType} /> */}
        <TextField
          label='Billing Type'
          defaultValue={billingType}
          InputProps={{
            readOnly: true
          }}
          variant='outlined'
        />
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
          {avatars.map(el => (
            <Avatar key={el} alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
          ))}
        </AvatarGroup>
        <h2 className='text-center text-sm my-2 text-white'>{tableName}</h2>

        <CountUpTimer startTime={timer} running={startTable}></CountUpTimer>

        {isTableActive ? (
          startTable ? (
            <Button onClick={() => handleStop(tableName)} className='text-white outline-white py-0 my-12'>
              <span className='ri-stop-fill'></span>
              Stop
            </Button>
          ) : (
            <Button onClick={() => handleStart(tableName)} className='text-white outline-white py-0 my-12'>
              <span className='ri-play-fill'></span>
              Start
            </Button>
          )
        ) : (
          <Button onClick={() => handleCheckout(tableName)} className='text-white outline-white py-0 my-12'>
            <span className='ri-bill-fill size-4'></span>
            Checkout
          </Button>
        )}
      </div>
    </div>
  )
}

export default PoolCard
