// Component Imports
import { Device } from '@/types/apps/ecommerceTypes'
import DeviceListTable from '@/views/apps/ecommerce/customers/list/DeviceListTable'

const deviceData: Device[] = [
  {
    id: 1,
    serialNumber: 'D1',
    activationDate: '11th May 2024',
    macId: '123.903.563.54',
    ipAddress: '127.0.9.2',
    storeId: 'S123',
    warrantyDate: '11th Dec 2024',
    status: 'Active'
  },
  {
    id: 2,
    serialNumber: 'D2',
    activationDate: '24th Jan 2024',
    macId: '563.543.563.54',
    ipAddress: '127.0.0.1',
    storeId: 'S134',
    warrantyDate: '10th Aug 2024',
    status: 'Inactive'
  },
  {
    id: 3,
    serialNumber: 'D3',
    activationDate: '15th April 2024',
    macId: '135.543.563.54',
    ipAddress: '127.7.8.1',
    storeId: 'S142',
    warrantyDate: '18th Nov 2024',
    status: 'Idle'
  },
  {
    id: 4,
    serialNumber: 'D4',
    activationDate: '9th Feb 2024',
    macId: '123.65.563.54',
    ipAddress: '127.23.7.1',
    storeId: 'S153',
    warrantyDate: '21st Sep 2024',
    status: 'Active'
  }
]

const DeviceDetails = async () => {
  return <DeviceListTable deviceData={deviceData} />
}

export default DeviceDetails
