// MUI Imports
import Grid from '@mui/material/Grid'

// Types Imports
import type { VerticalCardStatsPropsType } from '@/types/staffTypes'

// Components Imports
import CardStatVertical from '@components/card-statistics/Vertical'

const VerticalCard = ({ data }: { data: VerticalCardStatsPropsType[] }) => {
  if (data) {
    return (
      <Grid container spacing={6}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <CardStatVertical {...item} />
          </Grid>
        ))}
      </Grid>
    )
  }
}

export default VerticalCard
