// MUI Imports
import { CardStatsHorizontalWithAvatarProps } from '@/types/pages/widgetTypes'
import { CustomerDetailsDataType } from '@/types/staffTypes'
import Grid from '@mui/material/Grid'
import CustomerStatisticsCard from './CustomerStatisticsCard'

// Component Imports

const Overview = ({ data }: { data: CustomerDetailsDataType }) => {
  const customerStats: CardStatsHorizontalWithAvatarProps[] = [
    {
      avatarIcon: 'ri-money-rupee-circle-line',
      title: 'Wallet',
      stats: `₹${Number(data?.customers?.credit ?? 0).toFixed(2)}`,
      avatarColor: 'primary'
    },
    {
      avatarIcon: 'ri-gift-line',
      title: `Membership - ${data?.membership?.membershipName ?? 'NA'}`,
      stats: `${data?.membership?.membershipMin !== undefined ? `${data?.membership?.membershipMin}` : 0} minutes`,
      avatarColor: 'success'
    },
    {
      avatarIcon: 'ri-money-rupee-circle-line',
      title: 'Hours Spent',
      stats: `${Number(data?.hoursSpend ?? 0).toFixed(2)}`,
      avatarColor: 'error'
    },
    {
      avatarIcon: 'ri-money-rupee-circle-line',
      title: 'Amount Spent',
      stats: `₹${Number(data?.totalSpend ?? 0).toFixed(2)}`,
      avatarColor: 'info'
    },
    {
      avatarIcon: 'ri-star-smile-line',
      title: 'Games',
      stats: `${Number(data?.gameCount ?? 0).toFixed(2)}`,
      avatarColor: 'warning'
    },
    {
      avatarIcon: 'ri-vip-crown-line',
      title: 'Winner',
      stats: `${Number(data?.winner ?? 0).toFixed(2)}`,
      avatarColor: 'primary'
    },
    {
      avatarIcon: 'ri-star-smile-line',
      title: 'Reward Points',
      stats: `${(data?.customers?.rewardPoint !== undefined ? Number(data.customers.rewardPoint) : 0).toFixed(2)}`,
      avatarColor: 'success'
    },
    {
      avatarIcon: 'ri-vip-crown-line',
      title: 'Orders',
      stats: `${Number(data?.orders ?? 0).toFixed(2)}`,
      avatarColor: 'info'
    },
    {
      avatarIcon: 'ri-vip-crown-line',
      title: 'Credit Limit',
      stats: `₹${(data?.customers?.maxCredit !== undefined ? Number(data.customers.maxCredit) : 0).toFixed(2)}`,
      avatarColor: 'warning'
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
        <CustomerStatisticsCard data={customerStats} />
      </Grid>
    </Grid>
  )
}

export default Overview
