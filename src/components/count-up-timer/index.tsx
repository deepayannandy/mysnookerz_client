import { DateTime, Duration } from 'luxon'
import { useEffect, useState } from 'react'

const CountUpTimer = ({ startTime, endTime, running }: { startTime: string; endTime?: string; running: boolean }) => {
  const timeDiff = endTime
    ? DateTime.fromISO(endTime).diff(DateTime.fromISO(startTime))
    : DateTime.now().diff(DateTime.fromISO(startTime))

  const [time, setTime] = useState(timeDiff)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (running) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime.plus({ millisecond: 1000 }))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [running])

  const formatTime = (time: Duration) => {
    const timeArray = time.toFormat('hh:mm:ss').split(':')
    const hours = timeArray[0].padStart(2, '0')
    const minutes = timeArray[1].padStart(2, '0')
    const seconds = timeArray[2].padStart(2, '0')
    return (
      <div className='flex justify-between items-center'>
        <span className='border-2 rounded text-md p-1 text-center text-white border-slate-500'>{hours}</span>
        <span className='text-slate-500 mx-1'>:</span>
        <span className='border-2 rounded text-md p-1 text-center text-white border-slate-500'>{minutes}</span>
        <span className='text-slate-500 mx-1'>:</span>
        <span className='border-2 rounded text-md p-1 text-center text-white border-slate-500'>{seconds}</span>
      </div>
    )
  }

  return (
    <div>
      <div>{formatTime(time)}</div>
    </div>
  )
}

export default CountUpTimer
