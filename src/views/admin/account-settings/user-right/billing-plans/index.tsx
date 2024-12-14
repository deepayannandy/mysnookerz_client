// MUI Imports
import { UserDataType } from '@/types/adminTypes'
import Grid from '@mui/material/Grid'

// Component Imports
import InvoiceListTable from '../overview/InvoiceListTable'
import CurrentPlan from './CurrentPlan'

const BillingPlans = ({ data, getUserData }: { data: UserDataType; getUserData: () => void }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlan data={data} getUserData={getUserData} />
      </Grid>
      <Grid item xs={12}>
        <InvoiceListTable />
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
