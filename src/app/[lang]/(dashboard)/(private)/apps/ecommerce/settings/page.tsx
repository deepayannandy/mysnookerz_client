// React Imports
import type { ReactElement } from 'react'

// Next Imports

// Component Imports
import Settings from '@views/apps/ecommerce/settings'

import CheckoutTab from '../../../../../../../views/apps/ecommerce/settings/checkout'
import LocationsTab from '../../../../../../../views/apps/ecommerce/settings/locations'
import NotificationsTab from '../../../../../../../views/apps/ecommerce/settings/Notifications'
import PaymentsTab from '../../../../../../../views/apps/ecommerce/settings/payments'
import ShippingDeliveryTab from '../../../../../../../views/apps/ecommerce/settings/ShippingDelivery'
import StoreDetailsTab from '../../../../../../../views/apps/ecommerce/settings/store-details'

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  'store-details': <StoreDetailsTab />,
  payments: <PaymentsTab />,
  checkout: <CheckoutTab />,
  'shipping-delivery': <ShippingDeliveryTab />,
  locations: <LocationsTab />,
  notifications: <NotificationsTab />
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} />
}

export default eCommerceSettings
