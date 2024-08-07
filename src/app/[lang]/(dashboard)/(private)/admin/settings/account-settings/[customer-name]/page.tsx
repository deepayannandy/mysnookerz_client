// React Imports
import type { ReactElement } from 'react'

// Next Imports

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports
import UserLeftOverview from '@/views/admin/master/account-settings/user-left-overview'
import UserRight from '@/views/admin/master/account-settings/user-right'

// Data Imports
import { getPricingData } from '@/app/server/actions'
import BillingPlans from '@/views/admin/master/account-settings/billing-plans'
import OverViewTab from '@/views/admin/master/account-settings/overview'
import ConnectionsTab from '@/views/admin/master/account-settings/user-right/connections'
import NotificationsTab from '@/views/admin/master/account-settings/user-right/notifications'
import SecurityTab from '@/views/admin/master/account-settings/user-right/security'

// Vars
const tabContentList = (data?: PricingPlanType[]): { [key: string]: ReactElement } => ({
  //@ts-ignore
  overview: <OverViewTab />,
  security: <SecurityTab />,
  // @ts-ignore
  'billing-plans': <BillingPlans data={data} />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/pages/pricing` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getPricingData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/pricing`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
} */

const AccountSettings = async () => {
  // Vars
  const data = await getPricingData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserLeftOverview />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRight tabContentList={tabContentList(data)} />
      </Grid>
    </Grid>
  )
}

export default AccountSettings
