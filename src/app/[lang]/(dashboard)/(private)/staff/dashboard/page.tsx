'use client'

import { DashboardDataType } from '@/types/staffTypes'
// MUI Imports
import Award from '@/views/staff/dashboard/Award'
import Transactions from '@/views/staff/dashboard/Transactions'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const DashboardDetails = () => {
  const [dashboardData, setDashboardData] = useState({} as DashboardDataType)

  // Hooks
  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const getDashboardData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    try {
      const response = await axios.get(`${apiBaseUrl}/admin/Dashboard/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setDashboardData(response.data)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <Award data={dashboardData.sales} />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        <Transactions data={dashboardData} />
      </Grid>
    </Grid>
  )
}

export default DashboardDetails
