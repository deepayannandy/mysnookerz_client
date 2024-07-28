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
    url: '/staff/dashboard',
    icon: 'ri-pie-chart-2-line',
    section: 'Dashboards'
  },
  {
    id: '2',
    name: 'History',
    url: '/staff/history',
    icon: 'ri-bar-chart-line',
    section: 'Dashboards'
  }
]

export default data
