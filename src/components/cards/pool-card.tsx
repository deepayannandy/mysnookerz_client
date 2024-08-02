import { Avatar, AvatarGroup, Button } from '@mui/material'
import { purple } from '@mui/material/colors'
import { useState } from 'react'
import CountUpTimer from '../count-up-timer'
const PoolCard = ({ avatars, timer, tableName }: { avatars: string[]; timer: string; tableName: string }) => {
  const [running, setRunning] = useState(false)
  return (
    <div className='relative'>
      <img className='size-full rotate-180' src={'/images/snooker-table/Snooker_table.png'} alt='' />
      <div className='absolute flex flex-col justify-end items-center bottom-0 h-2/3 bg-gradient-to-t from-secondary w-full rounded px-6'>
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12, bgcolor: purple[800] }
          }}
        >
          {avatars.map(el => (
            <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
          ))}
        </AvatarGroup>
        <h2 className=' text-center text-sm my-2'>{tableName}</h2>

        <CountUpTimer startTime={timer} running={running}></CountUpTimer>

        <Button onClick={() => setRunning(!running)} className='text-white outline-white py-0 my-12'>
          <span className={`${running ? 'ri-stop-fill' : 'ri-play-fill'}`}></span>
          {running ? 'Stop' : 'Start'}
        </Button>
      </div>
    </div>
  )
}

export default PoolCard
