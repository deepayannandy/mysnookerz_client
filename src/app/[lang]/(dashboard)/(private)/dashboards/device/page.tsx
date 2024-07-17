// Component Imports

import type { Device } from '@/types/apps/ecommerceTypes'
import DeviceListTable from '@/views/apps/ecommerce/customers/list/DeviceListTable'

const deviceData: Device[] = [
  {
    id: 1,
    serialNumber: 'D1',
    activationDate: '11 May 2024',
    macId: '123.903.563.54',
    ipAddress: '127.0.9.2',
    storeId: 'S123',
    warrantyDate: '11 Dec 2024',
    status: 'Active'
  },
  {
    id: 2,
    serialNumber: 'D2',
    activationDate: '24 Jan 2024',
    macId: '563.543.563.54',
    ipAddress: '127.0.0.1',
    storeId: 'S134',
    warrantyDate: '10 Aug 2024',
    status: 'Inactive'
  },
  {
    id: 3,
    serialNumber: 'D3',
    activationDate: '15 April 2024',
    macId: '135.543.563.54',
    ipAddress: '127.7.8.1',
    storeId: 'S142',
    warrantyDate: '18 Nov 2024',
    status: 'Idle'
  },
  {
    id: 4,
    serialNumber: 'D4',
    activationDate: '9 Feb 2024',
    macId: '123.65.563.54',
    ipAddress: '127.23.7.1',
    storeId: 'S153',
    warrantyDate: '21 Sep 2024',
    status: 'Active'
  }
]

const DeviceDetails = async () => {
  return <DeviceListTable deviceData={deviceData} />
}

export default DeviceDetails
