'use client'
import PoolCard from '@/components/cards/pool-card'

const data = [1, 2, 3, 4, 5, 6]
const BookingPage = () => {
  return (
    <div className='grid md:grid-cols-4 grid-cols-2 gap-2'>
      {data.map(el => (
        <PoolCard avatars={['1', '2', '3', '4', '5']} timer={'2023-07-31T10:59:58Z'} tableName={`Table-${el}`} />
      ))}
    </div>
  )
}

export default BookingPage
