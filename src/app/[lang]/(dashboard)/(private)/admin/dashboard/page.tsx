'use client'

import CardStatVertical from '@/components/card-statistics/Vertical'
import { DashboardDataType } from '@/types/staffTypes'
// MUI Imports
import Award from '@/views/admin/dashboard/Award'
import Transactions from '@/views/admin/dashboard/Transactions'
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
      {dashboardData?.sales >= 0 ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Award data={dashboardData.sales || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={5.5}>
            <Transactions data={dashboardData} />
          </Grid>
          <Grid item xs={12} sm={3} md={1.75}>
            <CardStatVertical
              title='Discount'
              stats={`₹${dashboardData.discount || 0}`}
              avatarIcon='ri-discount-percent-line'
              avatarColor='warning'
              // subtitle='Revenue Increase'
              // trendNumber='42%'
              // trend='positive'
            />
          </Grid>
          <Grid item xs={12} sm={3} md={1.75}>
            <CardStatVertical
              title='Credit'
              stats={`₹${dashboardData.credit || 0}`}
              avatarIcon='ri-refund-2-line'
              avatarColor='error'
              // subtitle='Revenue Increase'
              // trendNumber='42%'
              // trend='positive'
            />
          </Grid>
          {/* <Grid item xs={12}>
            <DueAmountTable data={dashboardData.creditHistoryToday ?? []} getDashboardData={getDashboardData} />
          </Grid> */}
          {/* <Grid item xs={12}>
            <TotalRevenueStackedBar />
          </Grid> */}
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
