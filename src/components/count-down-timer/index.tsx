import { DateTime, Duration } from 'luxon'
import { useEffect, useState } from 'react'

const CountdownTimer = ({
  startTime,
  endTime,
  pauseTime,
  pauseMinute,
  countdownMin,
  running,
  getAllTablesData
}: {
  startTime: string
  endTime?: string
  pauseTime?: string
  pauseMinute?: number
  countdownMin: number
  running: boolean
  getAllTablesData: () => void
}) => {
  const timeDiff = endTime
    ? DateTime.fromISO(endTime).diff(DateTime.fromISO(startTime), 'minutes').minutes
    : pauseTime
      ? DateTime.fromISO(pauseTime).diff(DateTime.fromISO(startTime), 'minutes').minutes
      : DateTime.now().diff(DateTime.fromISO(startTime), 'minutes').minutes

  let remainingTime = Number(countdownMin) - timeDiff
  if (pauseMinute) {
    remainingTime = Number(countdownMin) + Number(pauseMinute) - timeDiff
  }

  const remainingSeconds = remainingTime * 60
  const [time, setTime] = useState(remainingSeconds)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (running) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [running])

  if (time < 1) {
    getAllTablesData()
  }

  const formatTime = (time: number) => {
    const formattedTime = Duration.fromObject({ seconds: time }).toFormat('hh:mm:ss')
    const timeArray = formattedTime.split(':')
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

export default CountdownTimer
