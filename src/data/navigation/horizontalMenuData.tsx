// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const horizontalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): HorizontalMenuDataType[] => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].staffMenu,
    icon: 'ri-home-smile-line',
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary['navigation'].dashboard,
        icon: 'ri-pie-chart-2-line',
        href: '/staff/dashboard'
      },
      {
        label: dictionary['navigation'].booking,
        icon: 'ri-bar-chart-line',
        href: '/staff/booking'
      },
      {
        label: dictionary['navigation'].history,
        icon: 'ri-shopping-bag-3-line',
        href: '/staff/history'
      },
      {
        label: dictionary['navigation'].customer,
        icon: 'ri-car-line',
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
        icon: 'ri-user-line',
        href: '/admin/staff'
      },
      {
        label: dictionary['navigation'].settings,
        icon: 'ri-tv-2-line',
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

export default horizontalMenuData
