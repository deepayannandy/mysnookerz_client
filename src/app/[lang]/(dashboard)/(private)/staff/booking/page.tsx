'use client'
import PoolCard from '@/components/cards/pool-card'
import TableBill from '@/components/dialogs/table-bill'
import StartTableDrawer from '@/views/staff/booking/StartTableDrawer'
import { useState } from 'react'

const data = [
  { table: 'Table-1', isTableActive: false, startTable: false, billingType: 'Minute Billing' },
  { table: 'Table-2', isTableActive: true, startTable: false, billingType: 'Minute Billing' },
  { table: 'Table-3', isTableActive: true, startTable: false, billingType: 'Minute Billing' },
  { table: 'Table-4', isTableActive: true, startTable: false, billingType: 'Minute Billing' },
  { table: 'Table-5', isTableActive: true, startTable: false, billingType: 'Minute Billing' },
  { table: 'Table-6', isTableActive: true, startTable: false, billingType: 'Minute Billing' }
]

const BookingPage = () => {
  const [showBill, setShowBill] = useState(false)
  const [showStartForm, setShowStartForm] = useState(false)
  const [tableName, setTableName] = useState('')
  const [tableData, setTableData] = useState(data)

  const handleCheckout = (tableName: string) => {
    setTableName(tableName)
    setShowBill(true)
  }

  const handleStart = (tableName: string) => {
    setTableName(tableName)
    setShowStartForm(true)
  }

  const handleStop = (tableName: string) => {
    setTableName(tableName)
    const data = tableData.map(tData => {
      if (tData.table === tableName) {
        tData.startTable = false
        tData.isTableActive = false
      }
      return tData
    })
    setTableData(data)
    setShowBill(true)
  }

  return (
    <>
      <div className='grid md:grid-cols-4 grid-cols-2 gap-4'>
        {tableData.map(el => (
          <PoolCard
            key={el.table}
            avatars={['1', '2', '3', '4', '5']}
            timer={'2023-07-31T10:59:58Z'}
            tableName={el.table}
            billingType={el.billingType}
            isTableActive={el.isTableActive}
            startTable={el.startTable}
            handleCheckout={handleCheckout}
            handleStart={handleStart}
            handleStop={handleStop}
          />
        ))}
      </div>
      <TableBill open={showBill} setOpen={setShowBill} tableName={tableName} />
      <StartTableDrawer
        open={showStartForm}
        handleClose={() => setShowStartForm(!showStartForm)}
        tableName={tableName}
        tableData={tableData}
        setTableData={setTableData}
      />
    </>
  )
}

export default BookingPage
