'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports

// Component Imports
import DeviceCard from '@/components/cards/DeviceCard'
import { DeviceDataType } from '@/types/adminTypes'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const DeviceDataCards = () => {
  const [data, setData] = useState([] as DeviceDataType[])

  // // Vars
  // const buttonProps: ButtonProps = {
  //   variant: 'outlined',
  //   children: '+ Add Device',
  //   size: 'small'
  // }

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getDevicesData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    try {
      const response = await axios.get(`${apiBaseUrl}/devices/byStore/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getDevicesData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col gap-5'>
      {data.map((deviceDetails, index) => (
        <DeviceCard
          key={`${deviceDetails._id}_${index}`}
          deviceDetails={deviceDetails}
          getDevicesData={getDevicesData}
        />
      ))}
    </div>
  )
}

export default DeviceDataCards
