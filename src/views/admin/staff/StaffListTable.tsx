'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils'
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

import NewStaffRegistration from '@/components/dialogs/ new-staff-registration'
import { StaffDataType } from '@/types/adminTypes'
import { CustomerDataType } from '@/types/staffTypes'
import tableStyles from '@core/styles/table.module.css'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import { useParams, usePathname, useRouter } from 'next/navigation'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
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

type StaffDataWithAction = StaffDataType & {
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

const columnHelper = createColumnHelper<StaffDataWithAction>()

const StaffListTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as CustomerDataType[])
  const [globalFilter, setGlobalFilter] = useState('')
  const [newStaffRegistrationDialogOpen, setNewStaffRegistrationDialogOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getStaffData = async () => {
    // const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    // const token = localStorage.getItem('token')
    // try {
    //   const response = await axios.get(`${apiBaseUrl}/client/`, { headers: { 'auth-token': token } })
    //   if (response && response.data) {
    //     setData(response.data)
    //   }
    // } catch (error: any) {
    //   if (error?.response?.status === 400) {
    //     const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
    //     return router.replace(redirectUrl)
    //   }
    //   toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    // }
  }

  const staffData: StaffDataType[] = [
    {
      date: '22 May 2024',
      transactionId: 'T1412424242',
      customerName: 'Abcd',
      description: 'this is description',
      start: '10:00 AM',
      end: '12:00 PM',
      time: '2 hours',
      table: '1',
      meals: 'affafsc',
      discount: 300,
      netPay: 4000,
      status: 'Paid'
    },
    {
      date: '12 May 2024',
      transactionId: 'T1562424242',
      customerName: 'Atdgs',
      description: 'this is not description',
      start: '11:00 AM',
      end: '04:00 PM',
      time: '5 hours',
      table: '2',
      meals: 'affaafsffsc',
      discount: 5000,
      netPay: 40000,
      status: 'Not Paid'
    },
    {
      date: '20 May 2024',
      transactionId: 'T1562424242',
      customerName: 'tarsa',
      description: 'this was description',
      start: '09:00 AM',
      end: '12:00 PM',
      time: '3 hours',
      table: '3',
      meals: 'affafafsc',
      discount: 3000,
      netPay: 8000,
      status: 'Running'
    }
  ]

  useEffect(() => {
    //getHistoryData()
    setData(staffData)
  }, [])

  const columns = useMemo<ColumnDef<StaffDataWithAction, any>[]>(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.date}</Typography>
      }),
      columnHelper.accessor('transactionId', {
        header: 'Transaction ID',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.transactionId}</Typography>
      }),
      columnHelper.accessor('customerName', {
        header: 'Customer Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.customerName}</Typography>
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.description}</Typography>
      }),
      columnHelper.accessor('start', {
        header: 'Start',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.start}</Typography>
      }),
      columnHelper.accessor('end', {
        header: 'End',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.end}</Typography>
      }),
      columnHelper.accessor('time', {
        header: 'Time',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.time}</Typography>
      }),
      columnHelper.accessor('table', {
        header: 'Table',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.table}</Typography>
      }),
      columnHelper.accessor('meals', {
        header: 'Meals',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.meals}</Typography>
      }),
      columnHelper.accessor('discount', {
        header: 'Discount',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.discount}</Typography>
      }),
      columnHelper.accessor('netPay', {
        header: 'Net Pay',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.netPay}</Typography>
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
    data: data as StaffDataType[],
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
        <CardContent className='flex justify-between flex-col items-start sm:flex-col sm:items-end gap-y-4'>
          {/* <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
          /> */}
          <div className='flex gap-x-4'>
            {/* <Button variant='outlined' color='secondary' startIcon={<i className='ri-upload-2-line' />}>
              Export
            </Button> */}
            <Button
              variant='contained'
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={() => setNewStaffRegistrationDialogOpen(!newStaffRegistrationDialogOpen)}
            >
              New Registration
            </Button>
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
      <NewStaffRegistration
        open={newStaffRegistrationDialogOpen}
        setOpen={setNewStaffRegistrationDialogOpen}
        getStaffData={getStaffData}
      />
    </>
  )
}

export default StaffListTable
