'use client'
import PoolCard from '@/components/cards/pool-card'
import TableBill from '@/components/dialogs/table-bill'
import { TableDataType } from '@/types/adminTypes'
import StartTableDrawer from '@/views/staff/booking/StartTableDrawer'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const BookingPage = () => {
  const [showBill, setShowBill] = useState(false)
  const [showStartForm, setShowStartForm] = useState(false)
  const [tableData, setTableData] = useState({} as TableDataType)
  const [allTablesData, setAllTablesData] = useState([] as TableDataType[])

  const getAllTablesData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/table`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setAllTablesData(response.data)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getAllTablesData()
  }, [])

  const handleCheckout = (tableData: TableDataType) => {
    setTableData(tableData)
    setShowBill(true)
  }

  const handleStart = (tableData: TableDataType) => {
    setTableData(tableData)
    setShowStartForm(true)
  }

  const handleStop = async (tableData: TableDataType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/games/stopGame/${tableData._id}`,
        {},
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
    setTableData(tableData)
    setShowBill(true)
  }

  return (
    <>
      <div className='grid md:grid-cols-4 grid-cols-2 gap-4'>
        {allTablesData.map(tableData => (
          <PoolCard
            key={tableData.tableName}
            tableData={tableData}
            handleCheckout={handleCheckout}
            handleStart={handleStart}
            handleStop={handleStop}
          />
        ))}
      </div>
      <TableBill open={showBill} setOpen={setShowBill} tableData={tableData} getAllTablesData={getAllTablesData} />
      <StartTableDrawer
        open={showStartForm}
        handleClose={() => setShowStartForm(!showStartForm)}
        tableData={tableData}
        getAllTablesData={getAllTablesData}
      />
    </>
  )
}

export default BookingPage
