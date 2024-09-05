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
      stats: `₹${data?.tableCredit ?? 'NA'}`,
      content: 'Table Credit',
      description: `${data?.cafeCredit !== undefined ? `₹${data?.cafeCredit} Cafe Credit` : 'NA'}    ${data?.customers?.maxCredit !== undefined ? `₹${data?.customers?.maxCredit} Credit limit` : ''} `
    },
    {
      color: 'success',
      avatarIcon: 'ri-gift-line',
      title: 'Membership',
      chipLabel: `${data?.membership?.membershipName ?? 'NA'}`,
      description: `${data?.membership?.membershipMin !== undefined ? `${data?.membership?.membershipMin} membership minutes` : 'NA'}`
    },
    {
      color: 'warning',
      avatarIcon: 'ri-star-smile-line',
      title: 'Games',
      stats: `${data?.gameWin ?? 0}`,
      content: 'Winner',
      description: `${data?.customers?.rewardPoint !== undefined ? `${data?.customers?.rewardPoint} Reward point` : 'NA'}`
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
        <OrderListTable orderData={tableData?.orderData} />
      </Grid>
    </Grid>
  )
}

export default Overview
