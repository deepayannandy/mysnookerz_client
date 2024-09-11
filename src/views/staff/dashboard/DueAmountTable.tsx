'use client'

// React Imports

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Type Imports

// Util Imports

// Style Imports
import CustomAvatar from '@/@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import PayDue from '@/components/dialogs/pay-dues'
import { DueAmountDataType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import tableStyles from '@core/styles/table.module.css'
import { Button } from '@mui/material'

// type InvoiceStatusObj = {
//   [key: string]: {
//     icon: string
//     color: ThemeColor
//   }
// }

// Vars
// const invoiceStatusObj: InvoiceStatusObj = {
//   Sent: { color: 'secondary', icon: 'ri-send-plane-2-line' },
//   Paid: { color: 'success', icon: 'ri-check-line' },
//   Draft: { color: 'primary', icon: 'ri-mail-line' },
//   'Partial Payment': { color: 'warning', icon: 'ri-pie-chart-2-line' },
//   'Past Due': { color: 'error', icon: 'ri-information-line' },
//   Downloaded: { color: 'info', icon: 'ri-arrow-down-line' }
// }
const getColumns = (getDashboardData: () => void) => {
  const columnHelper = createColumnHelper<DueAmountDataType>()

  const columns = [
    columnHelper.accessor('transactionId', {
      header: 'TransactionId',
      cell: ({ row }) => <Typography>{row.original.transactionId}</Typography>
    }),
    columnHelper.accessor('customerName', {
      header: 'Customer Name',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          {getAvatar({ customerName: row.original.customerName })}
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.customerName}
            </Typography>
            {/* <Typography variant='body2'>{row.original.companyEmail}</Typography> */}
          </div>
        </div>
      )
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: ({ row }) => <Typography>{row.original.description}</Typography>
    }),
    columnHelper.accessor('credit', {
      header: 'Due',
      cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.credit ?? 0}`}</Typography>
    }),
    columnHelper.accessor('cafeCredit', {
      header: 'Cafe Due',
      cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.cafeCredit ?? 0}`}</Typography>
    }),
    columnHelper.accessor('totalDue', {
      header: 'Total Due',
      cell: ({ row }) => (
        <Typography color='text.primary'>{`₹${Number(row.original.credit ?? 0) + Number(row.original.cafeCredit ?? 0)}`}</Typography>
      )
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: ({ row }) => (
        <OpenDialogOnElementClick
          element={Button}
          elementProps={{
            children: 'Pay',
            color: 'success'
          }}
          dialog={PayDue}
          dialogProps={{
            getCustomerData: getDashboardData,
            customerData: {
              customerId: row.original.customerId,
              credit: Number(row.original.credit ?? 0) + Number(row.original.cafeCredit ?? 0)
            }
          }}
        />
      )
      // <Button className='border text-green-500' onClick={}>Pay</Button>
    })
  ]

  return columns
}

const getAvatar = (params: Pick<DueAmountDataType, 'customerName'>) => {
  const { customerName } = params

  //   if (avatar) {
  //     return <CustomAvatar src={avatar} skin='light' size={34} />
  //   } else {  }
  return (
    <CustomAvatar skin='light' size={34}>
      {getInitials(customerName)}
    </CustomAvatar>
  )
}

const DueAmountTable = ({ data, getDashboardData }: { data: DueAmountDataType[]; getDashboardData: () => void }) => {
  // Hooks
  const table = useReactTable({
    data,
    columns: getColumns(getDashboardData),
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    }
  })

  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  )
}

export default DueAmountTable
