'use client'

import { StoreDataType } from '@/types/adminTypes'
import { getPlanAccessControl } from '@/utils/Utils'
// MUI Imports
import HappyHours from '@/views/admin/store-settings/master/HappyHours'
import NightTime from '@/views/admin/store-settings/master/NightTime'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

// Component Imports

const MasterDetails = () => {
  const [data, setData] = useState({} as StoreDataType)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getStoreData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
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

  const submitData = async <T,>(data: T, message: string) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    try {
      const response = await axios.patch(`${apiBaseUrl}/store/${storeId}`, data, { headers: { 'auth-token': token } })
      if (response && response.data) {
        getStoreData()
        // resetForm()
        toast.success(`${message}`)
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
    getStoreData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const planAccessControl = getPlanAccessControl()

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <div className='border rounded-lg'>
        <NightTime storeData={data} submitData={submitData} />
      </div>
      <div className='border rounded-lg'>
        {planAccessControl.happyHours ? <HappyHours storeData={data} submitData={submitData} /> : <></>}
      </div>
      {/* <div className='border rounded-lg'>
        <ProductInformation />
      </div>  */}
    </div>
  )
}

export default MasterDetails
