'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

// Third-party Imports
import * as matchSortedUtils from '@tanstack/match-sorter-utils'
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

// Style Imports

import SearchInput from '@/components/Search'
import { HistoryDataType } from '@/types/staffTypes'
import tableStyles from '@core/styles/table.module.css'
import { CardContent, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: matchSortedUtils.RankingInfo
  }
}

type StatusChipColorType = {
  color: ThemeColor
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Paid: { color: 'success' },
  Running: { color: 'primary' },
  'Not Paid': { color: 'error' }
}

type HistoryDataWithAction = HistoryDataType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = matchSortedUtils.rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const columnHelper = createColumnHelper<HistoryDataWithAction>()

const HistoryTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as HistoryDataType[])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getCustomerNamesToShow = (customerNames: string) => {
    const customerNamesArray = customerNames.split(',')
    if (customerNamesArray.length > 2) {
      return [customerNamesArray[0], customerNamesArray[1]].join(',')
    }
    return customerNames
  }

  const getHistoryData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/history/`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getHistoryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = useMemo<ColumnDef<HistoryDataWithAction, any>[]>(
    () => [
      // columnHelper.accessor('transactionId', {
      //   header: 'Transaction ID',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.transactionId}</Typography>
      // }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {DateTime.fromISO(row.original.date).toFormat('dd LLL yyyy')}
            </Typography>
            <Typography variant='body2'>{row.original.transactionId}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('customerName', {
        header: 'Customer Name',
        cell: ({ row }) => (
          <Tooltip title={row.original.customerName} placement='top' className='cursor-pointer'>
            <Typography className='text-wrap' color='text.primary'>
              {getCustomerNamesToShow(row.original.customerName)}
            </Typography>
          </Tooltip>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.description}</Typography>
      }),
      columnHelper.accessor('startTime', {
        header: 'Start/End Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {DateTime.fromISO(row.original.startTime).toFormat('hh:mm:ss a')}
            </Typography>
            <Typography className='font-medium' color='text.primary'>
              {DateTime.fromISO(row.original.endTime).toFormat('hh:mm:ss a')}
            </Typography>
          </div>
        )
      }),
      // columnHelper.accessor('endTime', {
      //   header: 'End',
      //   cell: ({ row }) => (
      //     <Typography color='text.primary'>{DateTime.fromISO(row.original.endTime).toFormat('hh:mm:ss a')}</Typography>
      //   )
      // }),
      columnHelper.accessor('time', {
        header: 'Time',
        cell: ({ row }) => <Typography color='text.primary'>{`${row.original.time} Mins`}</Typography>
      }),
      columnHelper.accessor('booking', {
        header: 'Booking',
        cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.booking}`}</Typography>
      }),
      columnHelper.accessor('meal', {
        header: 'Meals',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.meal}</Typography>
      }),
      columnHelper.accessor('discount', {
        header: 'Discount',
        cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.discount || 0}`}</Typography>
      }),
      columnHelper.accessor('netPay', {
        header: 'Net Pay',
        cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.netPay}`}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              label={row.original.status}
              variant='tonal'
              color={statusChipColor[row.original.status]?.color}
              size='small'
            />
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as HistoryDataType[],
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
    <>
      <Card>
        <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-end gap-y-2'>
          <Typography className='text-xl font-bold'>History</Typography>
          <div className='flex gap-x-4'>
            <SearchInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search'
              //className='is-full sm:is-auto'
            />
          </div>
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
                      <tr
                        key={row.id}
                        className={classnames('hover:bg-[var(--mui-palette-action-hover)]', {
                          selected: row.getIsSelected()
                        })}
                      >
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
    </>
  )
}

export default HistoryTable
