// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports

// Component Imports
import { CustomerDetailsDataType } from '@/types/staffTypes'
import CustomerDetails from './CustomerDetails'
import CustomerMembership from './CustomerMembership'

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
      <Grid item xs={12}>
        <CustomerMembership customerData={customerData} getCustomerData={getCustomerData} />
      </Grid>
    </Grid>
  )
}

export default CustomerLeftOverview
