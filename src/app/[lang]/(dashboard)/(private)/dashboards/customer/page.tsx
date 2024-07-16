import CustomerListTable from '@/views/apps/ecommerce/customers/list/CustomerListTable'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const CustomerDetails = async () => {
  const data = await getEcommerceData()

  return <CustomerListTable customerData={data?.customerData} />
}

export default CustomerDetails
