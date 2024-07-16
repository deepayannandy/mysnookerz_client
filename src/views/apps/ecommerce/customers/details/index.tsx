// React Imports
import type { ReactElement } from 'react'

// Next Imports

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { Customer } from '@/types/apps/ecommerceTypes'

// Component Imports
import CustomerLeftOverview from './customer-left-overview'
import CustomerRight from './customer-right'
import CustomerDetailsHeader from './CustomerDetailsHeader'

import AddressBillingTab from '../../../../../views/apps/ecommerce/customers/details/customer-right/address-billing'
import NotificationsTab from '../../../../../views/apps/ecommerce/customers/details/customer-right/notification'
import OverViewTab from '../../../../../views/apps/ecommerce/customers/details/customer-right/overview'
import SecurityTab from '../../../../../views/apps/ecommerce/customers/details/customer-right/security'

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  //@ts-ignore
  overview: <OverViewTab />,
  security: <SecurityTab />,
  addressBilling: <AddressBillingTab />,
  notifications: <NotificationsTab />
})

const CustomerDetails = ({ customerData, customerId }: { customerData?: Customer; customerId: string }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CustomerDetailsHeader customerId={customerId} />
      </Grid>
      <Grid item xs={12} md={4}>
        <CustomerLeftOverview customerData={customerData} />
      </Grid>
      <Grid item xs={12} md={8}>
        <CustomerRight tabContentList={tabContentList()} />
      </Grid>
    </Grid>
  )
}

export default CustomerDetails
