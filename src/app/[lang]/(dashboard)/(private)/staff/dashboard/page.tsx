'use client'

import { DashboardDataType } from '@/types/staffTypes'
// MUI Imports
import Award from '@/views/staff/dashboard/Award'
import Transactions from '@/views/staff/dashboard/Transactions'
import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const DashboardDetails = () => {
  const [dashboardData, setDashboardData] = useState({} as DashboardDataType)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getDashboardData = async () => {
    const storeId = localStorage.getItem('storeId')
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/admin/Dashboard/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setDashboardData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  // useEffect(() => {
  //   if (storeId) {
  //     getDashboardData()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    // Function to continuously try fetching the Store ID from localStorage
    const checkForId = () => {
      const storedId = localStorage.getItem('storeId')
      let time: NodeJS.Timeout

      if (storedId) {
        getDashboardData()
        return () => clearTimeout(time)
      } else {
        time = setTimeout(checkForId, 500)
      }
    }

    checkForId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {dashboardData?.sales ? (
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Award data={dashboardData.sales} />
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Transactions data={dashboardData} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Skeleton variant='rectangular' height={200} />
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Skeleton variant='rectangular' height={200} />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default DashboardDetails
