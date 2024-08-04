import { Avatar, AvatarGroup, Button } from '@mui/material'
import CountUpTimer from '../count-up-timer'

const PoolCard = ({
  avatars,
  timer,
  tableName,
  isTableActive,
  startTable,
  handleCheckout,
  handleStart,
  handleStop
}: {
  avatars: string[]
  timer: string
  tableName: string
  isTableActive: boolean
  startTable: boolean
  handleCheckout: (tableName: string) => void
  handleStart: (tableName: string) => void
  handleStop: (tableName: string) => void
}) => {
  return (
    <div className='relative'>
      <img className='size-full rotate-180' src={'/images/snooker-table/Snooker_table.png'} alt='' />
      <div className='absolute flex flex-col justify-end items-center bottom-0 h-2/3 bg-gradient-to-t from-secondary w-full rounded px-6'>
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
            <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
          ))}
        </AvatarGroup>
        <h2 className=' text-center text-sm my-2'>{tableName}</h2>

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
