// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import RechartsLineChart from '@/views/charts/recharts/RechartsLineChart'

const data = {
  title: 'Sales'
}

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RechartsLineChart {...data} />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
