// React Imports
import type { ReactElement } from 'react'

// Next Imports

// Component Imports
import AccountSettings from '@views/pages/account-settings'

import AccountTab from '../../../../../../views/pages/account-settings/account'
import BillingPlansTab from '../../../../../../views/pages/account-settings/billing-plans'
import ConnectionsTab from '../../../../../../views/pages/account-settings/connections'
import NotificationsTab from '../../../../../../views/pages/account-settings/notifications'
import SecurityTab from '../../../../../../views/pages/account-settings/security'

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />,
  security: <SecurityTab />,

  // @ts-ignore
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const AccountSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage
