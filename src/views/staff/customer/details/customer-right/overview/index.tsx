// MUI Imports
import { CardStatsCustomerStatsProps } from '@/types/pages/widgetTypes'
import { CustomerDetailsDataType } from '@/types/staffTypes'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

// Component Imports
import CustomerStatisticsCard from './CustomerStatisticsCard'
import OrderListTable from './OrderListTable'

const Overview = ({ data }: { data: CustomerDetailsDataType }) => {
  const [tableData, setTableData] = useState([])

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getTableData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    if (data?.customers?._id) {
      try {
        const response = await axios.get(`${apiBaseUrl}/customerHistory/${data.customers._id}`, {
          headers: { 'auth-token': token }
        })
        if (response && response.data) {
          setTableData(response.data)
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
          return router.replace(redirectUrl)
        }
        toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      }
    }
  }

  useEffect(() => {
    getTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const customerStats: CardStatsCustomerStatsProps[] = [
    {
      color: 'primary',
      avatarIcon: 'ri-money-rupee-circle-line',
      title: 'Total Credit',
      stats: `₹${data?.customers?.credit ?? 0}`,
      content: 'Total Due',
      description: `₹${data?.customers?.maxCredit !== undefined ? `${data?.customers?.maxCredit}` : 0} Credit limit`
    },
    {
      color: 'success',
      avatarIcon: 'ri-gift-line',
      title: 'Membership',
      chipLabel: `${data?.membership?.membershipName ?? 'NA'}`,
      description: `${data?.membership?.membershipMin !== undefined ? `${data?.membership?.membershipMin}` : 0} membership minutes`
    },
    {
      color: 'warning',
      avatarIcon: 'ri-star-smile-line',
      title: 'Games',
      stats: `${data?.gameWin ?? 0}`,
      content: 'Winner',
      description: `${data?.customers?.rewardPoint !== undefined ? `${data?.customers?.rewardPoint}` : 0} Reward point`
    }
    // {
    //   color: 'info',
    //   avatarIcon: 'ri-vip-crown-line',
    //   title: 'coupons',
    //   stats: '21',
    //   content: 'Coupons you win',
    //   description: 'Use coupon on next purchase'
    // }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CustomerStatisticsCard customerStatData={customerStats} />
      </Grid>
      <Grid item xs={12}>
        <OrderListTable orderData={tableData} />
      </Grid>
    </Grid>
  )
}

export default Overview
