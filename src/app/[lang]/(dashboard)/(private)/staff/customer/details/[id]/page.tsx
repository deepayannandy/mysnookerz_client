'use client'

// React Imports
import { ReactElement, useEffect, useState } from 'react'

// Next Imports

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import AddOldCredit from '@/components/dialogs/add-old-credit'
import DeleteConfirmation from '@/components/dialogs/delete-confirmation'
import SetCreditLimit from '@/components/dialogs/set-credit-limit'
import { CustomerDetailsDataType } from '@/types/staffTypes'
import CustomerLeftOverview from '@/views/staff/customer/details/customer-left-overview'
import CustomerRight from '@/views/staff/customer/details/customer-right'
import Overview from '@/views/staff/customer/details/customer-right/overview'
import CustomerPaymentHistoryTable from '@/views/staff/customer/details/customer-right/overview/OrderListTable'
import CustomerDetailsHeader from '@/views/staff/customer/details/CustomerDetailsHeader'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { getPlanAccessControl } from '@/utils/Utils'
import { Typography } from '@mui/material'

// Vars
const tabContentList = (customerData: CustomerDetailsDataType): { [key: string]: ReactElement } => ({
  overview: <Overview data={customerData} />
  //   security: <SecurityTab />,
  //   addressBilling: <AddressBillingTab />,
  //   notifications: <NotificationsTab />
})

const CustomerDetails = ({ params }: { params: { id: string } }) => {
  const [customerData, setCustomerData] = useState({} as CustomerDetailsDataType)
  const [paymentHistoryData, setPaymentHistoryData] = useState([])
  const [creditLimitDialogOpen, setCreditLimitDialogOpen] = useState(false)
  const [oldCreditDialogOpen, setOldCreditDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getCustomerData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`${apiBaseUrl}/customer/${params.id}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setCustomerData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const getPaymentHistoryData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`${apiBaseUrl}/customerHistory/${params.id}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        setPaymentHistoryData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getCustomerData()
    getPaymentHistoryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteCustomer = async () => {
    const customerId = customerData?.customers?._id
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`${apiBaseUrl}/customer/${customerId}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        getCustomerData()
        setDeleteConfirmationDialogOpen(false)
        toast.success('Customer deleted successfully')

        const redirectUrl = `/${locale}/staff/customer`
        return router.replace(redirectUrl)
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.customerProfile ? (
        <>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CustomerDetailsHeader
                boardingDate={customerData?.customers?.onBoardingDate}
                customerData={customerData}
                getCustomerData={getCustomerData}
                setCreditLimitDialogOpen={setCreditLimitDialogOpen}
                setOldCreditDialogOpen={setOldCreditDialogOpen}
                setDeleteConfirmationDialogOpen={setDeleteConfirmationDialogOpen}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomerLeftOverview customerData={customerData} getCustomerData={getCustomerData} />
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomerRight tabContentList={tabContentList(customerData)} />
            </Grid>
            <Grid item xs={12}>
              <CustomerPaymentHistoryTable paymentHistoryData={paymentHistoryData} />
            </Grid>
          </Grid>
          <SetCreditLimit
            open={creditLimitDialogOpen}
            setOpen={setCreditLimitDialogOpen}
            getCustomerData={getCustomerData}
            customerData={customerData}
          />
          <AddOldCredit
            open={oldCreditDialogOpen}
            setOpen={setOldCreditDialogOpen}
            getCustomerData={getCustomerData}
            customerData={customerData}
          />
          <DeleteConfirmation
            open={deleteConfirmationDialogOpen}
            name={`customer (${customerData?.customers?.fullName})`}
            setOpen={setDeleteConfirmationDialogOpen}
            deleteApiCall={deleteCustomer}
          />
        </>
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default CustomerDetails
