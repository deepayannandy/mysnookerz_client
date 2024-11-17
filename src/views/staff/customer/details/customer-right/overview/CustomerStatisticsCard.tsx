// MUI Imports
import Grid from '@mui/material/Grid'

// Types Imports
import type { CardStatsHorizontalWithAvatarProps } from '@/types/pages/widgetTypes'

// Component Imports
import CardStatsHorizontalWithAvatar from '@components/card-statistics/HorizontalWithAvatar'

const CustomerStatisticsCard = ({ data }: { data: CardStatsHorizontalWithAvatarProps[] }) => {
  return (
    <Grid container spacing={6}>
      {data.map((item, index) => (
        <Grid key={index} item xs={12} sm={4}>
          <CardStatsHorizontalWithAvatar {...item} avatarSkin='light' />
        </Grid>
      ))}
    </Grid>
  )
}

export default CustomerStatisticsCard
