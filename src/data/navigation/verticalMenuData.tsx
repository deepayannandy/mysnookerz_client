// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].staffMenu,
    icon: 'ri-home-smile-line',
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary['navigation'].dashboard,
        href: '/staff/dashboard'
      },
      {
        label: dictionary['navigation'].booking,
        href: '/staff/booking'
      },
      {
        label: dictionary['navigation'].history,
        href: '/staff/history'
      },
      {
        label: dictionary['navigation'].customer,
        href: '/staff/customer'
      }
    ]
  },
  {
    label: dictionary['navigation'].adminMenu,
    icon: 'ri-mail-open-line',
    children: [
      {
        label: dictionary['navigation'].staff,
        href: '/admin/staff'
      },
      {
        label: dictionary['navigation'].settings,
        children: [
          {
            label: dictionary['navigation'].master,
            href: '/admin/settings/master'
          },
          {
            label: dictionary['navigation'].accountSettings,
            href: '/admin/settings/account-settings'
          }
        ]
      }
    ]
  }
]

export default verticalMenuData
