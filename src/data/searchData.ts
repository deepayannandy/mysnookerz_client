type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'ri-bar-chart-line',
    section: 'Admin Interface'
  },
  {
    id: '2',
    name: 'Booking',
    url: '/staff/booking',
    icon: 'ri-book-open-line',
    section: 'Staff Interface'
  },
  {
    id: '3',
    name: 'Game History',
    url: '/staff/game-history',
    icon: 'ri-list-unordered',
    section: 'Staff Interface'
  },
  {
    id: '4',
    name: 'Customer',
    url: '/staff/customer',
    icon: 'ri-pie-chart-2-line',
    section: 'Staff Interface'
  },
  {
    id: '5',
    name: 'Staff',
    url: '/admin/staff',
    icon: 'ri-user-line',
    section: 'Admin Interface'
  },
  {
    id: '6',
    name: 'Table',
    url: '/admin/store-settings/table',
    icon: 'ri-file-list-line',
    section: 'Store Settings'
  },
  {
    id: '7',
    name: 'Master',
    url: '/admin/store-settings/master',
    icon: 'ri-settings-2-line',
    section: 'Store Settings'
  },
  {
    id: '8',
    name: 'Control',
    url: '/admin/store-settings/control',
    icon: 'ri-user-settings-line',
    section: 'Store Settings'
  },
  {
    id: '9',
    name: 'Devices',
    url: '/admin/store-settings/devices',
    icon: 'ri-device-line',
    section: 'Store Settings'
  },
  {
    id: '10',
    name: 'Account Settings',
    url: '/admin/account-settings',
    icon: 'ri-file-user-line',
    section: 'Admin Interface'
  }
]

export default data
