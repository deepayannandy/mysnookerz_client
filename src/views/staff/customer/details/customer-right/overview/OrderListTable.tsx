'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports

// Util Imports

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { DateTime } from 'luxon'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type PayementStatusType = {
  text: string
  color: ThemeColor
}

type StatusChipColorType = {
  color: ThemeColor
}

export const paymentStatus: { [key: number]: PayementStatusType } = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

type PaymentHistoryDataType = {
  date: string
  customerName: string
  description: string
  quantity: number
  startTime: string
  endTime: string
  netPay: number
  discount: number
  paid: number
  due: number
  paidBy: string
}

type PaymentHistoryDataTypeWithAction = PaymentHistoryDataType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper<PaymentHistoryDataTypeWithAction>()

const CustomerPaymentHistoryTable = ({ paymentHistoryData }: { paymentHistoryData: PaymentHistoryDataType[] }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  // const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<PaymentHistoryDataTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => <Typography>{`${DateTime.fromISO(row.original.date).toFormat('dd LLL yyyy')}`}</Typography>
      }),
      columnHelper.accessor('customerName', {
        header: 'Customer',
        cell: ({ row }) => <Typography>{row.original.customerName}</Typography>
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Typography>{row.original.description}</Typography>
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: ({ row }) => <Typography>{row.original.quantity}</Typography>
      }),

      columnHelper.accessor('startTime', {
        header: 'Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            {row.original.startTime && row.original.endTime ? (
              <>
                <Typography className='font-medium' color='text.primary'>
                  {DateTime.fromISO(row.original.startTime).toFormat('hh:mm:ss a')}
                </Typography>
                <Typography className='font-medium' color='text.primary'>
                  {DateTime.fromISO(row.original.endTime).toFormat('hh:mm:ss a')}
                </Typography>
              </>
            ) : (
              <>-</>
            )}
          </div>
        )
      }),
      columnHelper.accessor('netPay', {
        header: 'Net Pay',
        cell: ({ row }) => <Typography>₹{row.original.netPay ?? 0}</Typography>
      }),
      columnHelper.accessor('discount', {
        header: 'Discount',
        cell: ({ row }) => <Typography>₹{row.original.discount ?? 0}</Typography>
      }),
      columnHelper.accessor('paid', {
        header: 'Paid',
        cell: ({ row }) => <Typography>₹{row.original.paid ?? 0}</Typography>
      }),
      columnHelper.accessor('due', {
        header: 'Due',
        cell: ({ row }) => <Typography>₹{row.original.due ?? 0}</Typography>
      })

      // columnHelper.accessor('action', {
      //   header: 'Actions',
      //   cell: ({ row }) => (
      //     <div className='flex items-center'>
      //       <OptionMenu
      //         iconButtonProps={{ size: 'medium' }}
      //         iconClassName='text-textSecondary text-[22px]'
      //         options={[
      //           {
      //             text: 'View',
      //             icon: 'ri-eye-line',
      //             href: getLocalizedUrl(`/apps/ecommerce/orders/details/${row.original.order}`, locale as Locale),
      //             linkProps: { className: 'flex items-center gap-2 is-full plb-1.5 pli-4' }
      //           },
      //           {
      //             text: 'Delete',
      //             icon: 'ri-delete-bin-7-line text-[22px]',
      //             menuItemProps: {
      //               onClick: () => setData(data?.filter(order => order.id !== row.original.id)),
      //               className: 'gap-2'
      //             }
      //           }
      //         ]}
      //       />
      //     </div>
      //   ),
      //   enableSorting: false
      // })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paymentHistoryData]
  )

  const table = useReactTable({
    data: paymentHistoryData as PaymentHistoryDataType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4'>
        <Typography variant='h5'>Payment History</Typography>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search'
          className='is-full sm:is-auto'
        />
      </CardContent>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='ri-arrow-up-s-line text-xl' />,
                            desc: <i className='ri-arrow-down-s-line text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      </>
                    )}
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
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component='div'
        className='border-bs'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' }
        }}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default CustomerPaymentHistoryTable
