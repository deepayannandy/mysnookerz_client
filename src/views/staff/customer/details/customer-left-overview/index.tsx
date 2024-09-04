// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports

// Component Imports
import { CustomerDetailsDataType } from '@/types/staffTypes'
import CustomerDetails from './CustomerDetails'

const CustomerLeftOverview = ({
  customerData,
  getCustomerData
}: {
  customerData: CustomerDetailsDataType
  getCustomerData: () => void
}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CustomerDetails customerData={customerData} getCustomerData={getCustomerData} />
      </Grid>
      {/* <Grid item xs={12}>
        <CustomerPlan />
      </Grid> */}
    </Grid>
  )
}

export default CustomerLeftOverview
