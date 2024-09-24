import { DateTime, Duration } from 'luxon'
import { useEffect, useState } from 'react'

const CountUpTimer = ({
  startTime,
  endTime,
  pauseTime,
  pauseMinute,
  running
}: {
  startTime: string
  endTime?: string
  pauseTime?: string
  pauseMinute?: number
  running: boolean
}) => {
  let timeDiff = endTime
    ? DateTime.fromISO(endTime).diff(DateTime.fromISO(startTime))
    : pauseTime
      ? DateTime.fromISO(pauseTime).diff(DateTime.fromISO(startTime))
      : DateTime.now().diff(DateTime.fromISO(startTime))

  if (pauseMinute) {
    timeDiff = timeDiff.minus({ minutes: pauseMinute })
  }

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
      <p className='text-xl'>
        {hours}
        <span className='text-base'>h</span> {minutes}
        <span className='text-base'>m</span> {seconds}
        <span className='text-base'>s</span>
      </p>
    )
  }

  return (
    <div>
      <div>{formatTime(time)}</div>
    </div>
  )
}

export default CountUpTimer
