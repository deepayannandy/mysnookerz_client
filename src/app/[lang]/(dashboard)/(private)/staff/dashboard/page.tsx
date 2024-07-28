// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { CardStatsCharacterProps } from '@/types/pages/widgetTypes'

// Components Imports
import Character from '@views/pages/widget-examples/statistics/Character'

// Data Imports
import LogisticsShipmentStatistics from '@/views/apps/logistics/dashboard/LogisticsShipmentStatistics'
import WeeklySales from '@/views/dashboards/crm/WeeklySales'
import NewVisitors from '@/views/dashboards/ecommerce/NewVisitors'
import TotalProfitStackedBar from '@/views/dashboards/ecommerce/TotalProfitStackedBar'
import Table from '@views/dashboards/ecommerce/Table'

import { getInvoiceData } from '@/app/server/actions'

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
  const statsCharacterData: CardStatsCharacterProps[] = [
    {
      title: 'Total Clients',
      stats: '13k',
      titleColor: 'info.main',
      src: '/images/illustrations/characters/9.png'
    },
    {
      title: 'New Clients',
      stats: '24k',
      titleColor: 'success.main',
      src: '/images/illustrations/characters/10.png'
    },
    {
      title: 'Expiring Clients',
      stats: '28k',
      titleColor: 'warning.main',
      src: '/images/illustrations/characters/11.png'
    },
    {
      title: 'Expired Clients',
      stats: '42k',
      titleColor: 'error.main',
      src: '/images/illustrations/characters/12.png'
    }
  ]

  const totalCustomerData = {
    title: 'Total Customers',
    count: 20543,
    increment: 34
  }

  const newCustomerData = {
    title: 'New Customers',
    count: 2054,
    increment: 23
  }

  const invoiceData = await getInvoiceData()

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <Horizontal data={data.statsHorizontal} />
      </Grid>
      <Grid item xs={12}>
        <LogisticsStatisticsCard data={data?.statsHorizontalWithBorder} />
      </Grid>
      <Grid item xs={12}>
        <UserListCards />
      </Grid>
      <Grid item xs={12} md={8}>
        <Transactions />
      </Grid>
      <Grid item xs={12} md={4}>
        <TotalSales />
      </Grid>
      <Grid item xs={12}>
        <Vertical data={data.statsVertical} />
      </Grid> */}
      <Grid item xs={12}>
        {/* @ts-ignore */}
        <Character data={statsCharacterData} />
      </Grid>
      <Grid item xs={12} md={6}>
        <NewVisitors {...totalCustomerData} />
      </Grid>
      <Grid item xs={12} md={6}>
        <NewVisitors {...newCustomerData} />
      </Grid>
      <Grid item xs={12}>
        <TotalProfitStackedBar />
      </Grid>
      <Grid item xs={12} md={6}>
        <LogisticsShipmentStatistics />
      </Grid>
      <Grid item xs={12} md={6}>
        <WeeklySales />
      </Grid>
      <Grid item xs={12} lg={12} className='order-last lg:order-[unset]'>
        <Table invoiceData={invoiceData.slice(0, 8)} />
      </Grid>
      {/* <Grid item xs={12}>
        <HorizontalStatisticsCard data={data?.statsHorizontalWithAvatar} />
      </Grid>
      <Grid item xs={12}>
        <CustomerStatisticsCard customerStatData={data?.customerStats} />
      </Grid>
      <Grid item xs={12} sm={4} xl={2}>
        <LineChartWithShadow />
      </Grid>
      <Grid item xs={12} sm={4} xl={2}>
        <BarChartWithNegativeValues />
      </Grid>
      <Grid item xs={12} sm={4} xl={2}>
        <LineAreaChart />
      </Grid>
      <Grid item xs={12} sm={4} xl={2}>
        <RadialBarChart />
      </Grid>
      <Grid item xs={12} sm={4} xl={2}>
        <DistributedColumnChart />
      </Grid>
      <Grid item xs={12} sm={4} xl={2}>
        <LineChart />
      </Grid> */}
    </Grid>
  )
}

export default DashboardDetails
