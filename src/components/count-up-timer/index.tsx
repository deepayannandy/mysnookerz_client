import { useEffect, useState } from 'react'

const CountUpTimer = ({ startTime, running }: { startTime: string; running: boolean }) => {
  const [time, setTime] = useState(new Date(startTime))

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (running) {
      timer = setInterval(() => {
        setTime(prevTime => new Date(prevTime.getTime() + 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [running])

  const formatTime = (time: Date) => {
    const hours = String(time.getUTCHours()).padStart(2, '0')
    const minutes = String(time.getUTCMinutes()).padStart(2, '0')
    const seconds = String(time.getUTCSeconds()).padStart(2, '0')
    return (
      <div>
        {' '}
        <span className='border-2 rounded text-md p-1 text-center mx-2'>{hours}</span>:
        <span className='border-2 rounded text-md p-1 text-center mx-2'>{minutes}</span>:
        <span className='border-2 rounded text-md p-1 text-center mx-2'>{seconds}</span>
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
