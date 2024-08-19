'use client'

import PoolCard from '@/components/cards/pool-card'
import { TableDataType } from '@/types/adminTypes'
import { CustomerDataType, CustomerListType } from '@/types/staffTypes'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const BookingPage = () => {
  //const [showBill, setShowBill] = useState(false)
  // const [showStartForm, setShowStartForm] = useState(false)
  // const [tableData, setTableData] = useState({} as TableDataType)
  const [allTablesData, setAllTablesData] = useState([] as TableDataType[])
  const [customersList, setCustomersList] = useState([] as CustomerListType[])

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getAllTablesData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/table`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setAllTablesData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
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
        const data = response.data.map((customer: CustomerDataType) => {
          return {
            customerId: customer._id,
            fullName: `${customer.fullName}(${customer.contact})`
          }
        })
        setCustomersList(data)
      }
    } catch (error: any) {
      // if (error?.response?.status === 401) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getAllTablesData()
    getCustomerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const handleCheckout = (tableData: TableDataType) => {
  //   setTableData(tableData)
  //   setShowBill(true)
  // }

  // const handleStart = (tableData: TableDataType) => {
  //   setTableData(tableData)
  //   setShowStartForm(true)
  // }

  // const handleStop = async (tableData: TableDataType) => {
  //   const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
  //   const token = localStorage.getItem('token')
  //   try {
  //     const response = await axios.patch(
  //       `${apiBaseUrl}/games/stopGame/${tableData._id}`,
  //       {},
  //       {
  //         headers: { 'auth-token': token }
  //       }
  //     )

  //     if (response && response.data) {
  //       getAllTablesData()
  //     }
  //   } catch (error: any) {
  //     // if (error?.response?.status === 400) {
  //     //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
  //     //   console.log(redirectUrl)
  //     //   return router.replace(redirectUrl)
  //     // }
  //     toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
  //   }
  //   setTableData(tableData)
  //   setShowBill(true)
  // }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {!allTablesData.length ? (
          <p className='text-center md:col-span-3 lg:col-span-4'> No Table data available</p>
        ) : (
          <>
            {allTablesData.map(tableDetails => (
              <PoolCard
                key={tableDetails.tableName}
                tableData={tableDetails}
                customersList={customersList}
                getAllTablesData={getAllTablesData}
              />
            ))}
          </>
        )}
      </div>
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
