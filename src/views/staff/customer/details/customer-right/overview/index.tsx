// MUI Imports
import { CardStatsCustomerStatsProps } from '@/types/pages/widgetTypes'
import { CustomerDetailsDataType } from '@/types/staffTypes'
import Grid from '@mui/material/Grid'

// Component Imports
import CustomerStatisticsCard from './CustomerStatisticsCard'
import OrderListTable from './OrderListTable'

const Overview = ({ data, tableData }: { data: CustomerDetailsDataType; tableData?: any }) => {
  const customerStats: CardStatsCustomerStatsProps[] = [
    {
      color: 'primary',
      avatarIcon: 'ri-money-rupee-circle-line',
      title: 'Total Credit',
      stats: `₹${data?.tableCredit}`,
      content: 'Table Credit',
      description: `₹${data?.cafeCredit} Cafe Credit   ₹${data?.customers?.maxCredit} Card limit`
    },
    {
      color: 'success',
      avatarIcon: 'ri-gift-line',
      title: 'Membership',
      chipLabel: `${data?.membership?.membershipName}`,
      description: `${data?.membership?.membershipMin} membership minutes`
    },
    {
      color: 'warning',
      avatarIcon: 'ri-star-smile-line',
      title: 'Games',
      stats: `${data?.gameWin}`,
      content: 'Winner',
      description: `${data?.customers?.rewardPoint} Reward point`
    },
    {
      color: 'info',
      avatarIcon: 'ri-vip-crown-line',
      title: 'coupons',
      stats: '21',
      content: 'Coupons you win',
      description: 'Use coupon on next purchase'
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CustomerStatisticsCard customerStatData={customerStats} />
      </Grid>
      <Grid item xs={12}>
        <OrderListTable orderData={tableData?.orderData} />
      </Grid>
    </Grid>
  )
}

export default Overview
