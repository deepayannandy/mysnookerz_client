// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports

// Components Imports

// Data Imports

import VerticalCard from '@/views/staff/dashboard/VerticalCard'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/pages/widget-examples` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getStatisticsData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/widget-examples`)

  if (!res.ok) {
    throw new Error('Failed to fetch statisticsData')
  }

  return res.json()
} */

const DashboardDetails = async () => {
  // Vars
  const data = [
    {
      title: 'Today Game Sale',
      stats: '862',
      avatarColor: 'primary',
      avatarIcon: 'ri-file-word-2-line'
    },
    {
      title: 'Today Food Sale',
      stats: '250k',
      avatarIcon: 'ri-pie-chart-2-line ',
      avatarColor: 'secondary'
    },
    {
      title: 'Today Credit',
      stats: '952k',
      avatarColor: 'success',
      avatarIcon: 'ri-money-dollar-circle-line'
    },
    {
      title: 'Today Profit',
      stats: '440k',
      avatarColor: 'error',
      avatarIcon: 'ri-car-line'
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* @ts-ignore */}
        <VerticalCard data={data} />
      </Grid>
    </Grid>
  )
}

export default DashboardDetails
