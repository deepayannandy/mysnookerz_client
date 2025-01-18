// MUI Imports
import { UserDataType } from '@/types/adminTypes'
import Grid from '@mui/material/Grid'

// Component Imports
import CurrentPlan from './CurrentPlan'
import SubscriptionHistoryTable from './SubscriptionHistoryTable'

const BillingPlans = ({ data, getUserData }: { data: UserDataType; getUserData: () => void }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlan data={data} getUserData={getUserData} />
      </Grid>
      <Grid item xs={12}>
        <SubscriptionHistoryTable />
      </Grid>
      {/* <Grid item xs={12}>
        <PaymentMethod />
      </Grid>
      <Grid item xs={12}>
        <BillingAddress />
      </Grid> */}
    </Grid>
  )
}

export default BillingPlans
