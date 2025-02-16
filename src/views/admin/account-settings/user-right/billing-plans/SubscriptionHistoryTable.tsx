'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import { useParams, usePathname, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TablePagination from '@mui/material/TablePagination'
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
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports

// Style Imports
import { SubscriptionPlanType } from '@/types/adminTypes'
import tableStyles from '@core/styles/table.module.css'
import { Tooltip } from '@mui/material'
import axios from 'axios'
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type StatusObj = {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
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

// Vars
const statusObj: StatusObj = {
  Active: { color: 'success', icon: 'ri-check-line' },
  Expired: { color: 'error', icon: 'ri-information-line' },
  Upcoming: { color: 'warning', icon: 'ri-send-plane-2-line' }
}

// Column Definitions
const columnHelper = createColumnHelper<SubscriptionPlanType>()

const SubscriptionHistoryTable = () => {
  // States
  const [data, setData] = useState([] as SubscriptionPlanType[])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getSubscriptionHistoryData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.get(`${apiBaseUrl}/storeSubscription/${storeId}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        setData(response.data)
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
    getSubscriptionHistoryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStatus = (startDate: string, endDate: string) => {
    const startDateValue = DateTime.fromISO(startDate).startOf('day')
    const endDateValue = DateTime.fromISO(endDate).endOf('day')

    if (startDateValue > DateTime.now()) {
      return 'Upcoming'
    } else if (startDateValue < DateTime.now() && DateTime.now() < endDateValue) {
      return 'Active'
    } else {
      return 'Expired'
    }
  }

  const columns = useMemo<ColumnDef<SubscriptionPlanType, any>[]>(
    () => [
      columnHelper.accessor('subscriptionName', {
        header: 'Name',
        cell: ({ row }) => <Typography>{row.original.subscriptionName}</Typography>
      }),
      columnHelper.accessor('startDate', {
        header: 'Start Date',
        cell: ({ row }) => (
          <Typography>{`${row.original.startDate ? DateTime.fromISO(row.original.startDate).toFormat('dd LLL yyyy') : ''}`}</Typography>
        )
      }),
      columnHelper.accessor('endDate', {
        header: 'End Date',
        cell: ({ row }) => (
          <Typography>{`${row.original.endDate ? DateTime.fromISO(row.original.endDate).toFormat('dd LLL yyyy') : ''}`}</Typography>
        )
      }),
      columnHelper.accessor('subscriptionAmount', {
        header: 'Amount',
        cell: ({ row }) => <Typography>{`₹${row.original.subscriptionAmount}`}</Typography>
      }),
      columnHelper.accessor('_id', {
        header: 'Status',
        cell: ({ row }) => (
          <Tooltip
            title={
              <div>
                <Typography variant='body2' component='span' className='text-inherit'>
                  {getStatus(row.original.startDate, row.original.endDate)}
                </Typography>
              </div>
            }
          >
            <CustomAvatar
              skin='light'
              color={statusObj[getStatus(row.original.startDate, row.original.endDate)].color}
              size={28}
            >
              <i
                className={classnames(
                  'text-base',
                  statusObj[getStatus(row.original.startDate, row.original.endDate)].icon
                )}
              />
            </CustomAvatar>
          </Tooltip>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as SubscriptionPlanType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
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
      <CardHeader title='Subscription History' sx={{ '& .MuiCardHeader-action': { m: 0 } }} />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} {...(header.id === 'action' && { className: 'is-24' })}>
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
                        <td key={cell.id} {...(cell.id.includes('action') && { className: 'is-24' })}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
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

export default SubscriptionHistoryTable
