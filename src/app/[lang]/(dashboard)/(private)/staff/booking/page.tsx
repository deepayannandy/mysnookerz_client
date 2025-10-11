'use client'

import useVerticalNav from '@/@menu/hooks/useVerticalNav'
import { BillPrintDataType } from '@/components/BillPrint'
import PoolCard from '@/components/cards/PoolCard'
import BillPrintPreviewInfo from '@/components/dialogs/bill-print-preview'
import BreakBill, { BreakBillType } from '@/components/dialogs/break-bill'
import OrderMeals from '@/components/dialogs/order-meals'
import TableBill from '@/components/dialogs/table-bill'
import { StoreDataType, TableDataType } from '@/types/adminTypes'
import { CustomerDataType, CustomerListType } from '@/types/staffTypes'
import { getPlanAccessControl } from '@/utils/Utils'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMedia } from 'react-use'

const BookingPage = () => {
  //const [showBill, setShowBill] = useState(false)
  // const [showStartForm, setShowStartForm] = useState(false)
  // const [tableData, setTableData] = useState({} as TableDataType)
  const [allTablesData, setAllTablesData] = useState([] as TableDataType[])
  const [customersList, setCustomersList] = useState([] as CustomerListType[])
  const [storeData, setStoreData] = useState({} as StoreDataType)
  const [tableData, setTableData] = useState({} as TableDataType)
  const [showMealCart, setShowMealCart] = useState(false)
  const [billPrint, setBillPrint] = useState(false)
  const [billData, setBillData] = useState({} as BillPrintDataType)
  const [showBill, setShowBill] = useState(false)
  const [showOnHoldBill, setShowOnHoldBill] = useState(false)
  const [showBreakBill, setShowBreakBill] = useState(false)
  const [breakData, setBreakData] = useState({} as BreakBillType)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const verticalNavOptions = useVerticalNav()

  const { isCollapsed } = verticalNavOptions
  const isLargeAndPopoutExpanded = useMedia('(min-width: 1200px) and (max-width: 1350px)', true) && !isCollapsed

  const getAllTablesData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/table`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setAllTablesData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const getCustomerData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/customer/myCustomers`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        const data = [] as CustomerListType[]

        response.data.forEach((customer: CustomerDataType) => {
          data.push({
            customerId: customer._id,
            fullName: `${customer.fullName}(${customer.contact})`,
            showBadge: (customer.maxCredit ?? 0) - (customer.credit ?? 0) <= 100,
            wallet: customer.wallet ?? 20
          })
        })

        setCustomersList(data)
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const getStoreData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setStoreData(response.data)
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
    getAllTablesData()
    getCustomerData()
    getStoreData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const planAccessControl = getPlanAccessControl()

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-3 ${isLargeAndPopoutExpanded ? 'grid-cols-3' : 'lg:grid-cols-4'} gap-4`}
      >
        {!allTablesData.length ? (
          <p className='text-center md:col-span-3 lg:col-span-4'> No Table data available</p>
        ) : (
          <>
            {allTablesData.map((tableDetails, index) => (
              <PoolCard
                key={`${tableDetails.tableName}_${index}`}
                tableData={tableDetails}
                customersList={customersList}
                allTablesData={allTablesData}
                storeData={storeData}
                getAllTablesData={getAllTablesData}
                getCustomerData={getCustomerData}
                setTableData={setTableData}
                setShowMealCart={setShowMealCart}
                setShowBill={setShowBill}
                setShowOnHoldBill={setShowOnHoldBill}
                setShowBreakBill={setShowBreakBill}
                setBreakData={setBreakData}
              />
            ))}
          </>
        )}
      </div>
      {showMealCart ? (
        <OrderMeals
          open={showMealCart}
          setOpen={setShowMealCart}
          tableData={tableData}
          setBillData={setBillData}
          setBillPrint={setBillPrint}
          getAllTablesData={getAllTablesData}
        />
      ) : (
        <></>
      )}

      {showBill ? (
        <TableBill
          open={showBill}
          setOpen={setShowBill}
          isOnHoldBill={showOnHoldBill}
          setShowOnHoldBill={setShowOnHoldBill}
          tableData={tableData}
          customersList={customersList}
          getAllTablesData={getAllTablesData}
          getCustomerData={getCustomerData}
          setBillData={setBillData}
          setBillPrint={setBillPrint}
        />
      ) : (
        <></>
      )}

      {showBreakBill ? (
        <BreakBill
          open={showBreakBill}
          setOpen={setShowBreakBill}
          setShowBill={setShowBill}
          tableData={tableData}
          breakData={breakData}
          customersList={customersList}
          setTableData={setTableData}
          getAllTablesData={getAllTablesData}
          getCustomerData={getCustomerData}
        />
      ) : (
        <></>
      )}

      {billPrint && storeData.StoreData?.isPrintEnable && planAccessControl.billPrint ? (
        <BillPrintPreviewInfo open={billPrint} setOpen={setBillPrint} data={billData} />
      ) : (
        <></>
      )}
      {/* <TableBill open={showBill} setOpen={setShowBill} tableData={tableData} getAllTablesData={getAllTablesData} /> */}
      {/* <StartTableDrawer
        open={showStartForm}
        handleClose={() => setShowStartForm(!showStartForm)}
        tableData={tableData}
        getAllTablesData={getAllTablesData}
      /> */}
    </>
  )
}

export default BookingPage
