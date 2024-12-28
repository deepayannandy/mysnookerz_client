'use client'

// React Imports

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// Third-party Imports
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

// Util Imports

// Style Imports
import CustomAvatar from '@/@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import PayDue from '@/components/dialogs/pay-dues'
import SearchInput from '@/components/Search'
import { Locale } from '@/configs/i18n'
import { DueAmountDataType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'
import tableStyles from '@core/styles/table.module.css'
import { Button, CardContent, TablePagination, ToggleButton } from '@mui/material'
import * as matchSortedUtils from '@tanstack/match-sorter-utils'
import axios from 'axios'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

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
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: matchSortedUtils.RankingInfo
  }
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

const columnHelper = createColumnHelper<DueAmountDataType>()

const getAvatar = (params: Pick<DueAmountDataType, 'fullName'>) => {
  const { fullName } = params

  //   if (avatar) {
  //     return <CustomAvatar src={avatar} skin='light' size={34} />
  //   } else {  }
  return fullName ? (
    <CustomAvatar skin='light' size={34}>
      {getInitials(fullName)}
    </CustomAvatar>
  ) : (
    <></>
  )
}

const DueAmountTable = () => {
  const [data, setData] = useState([] as DueAmountDataType[])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isAllFilterApplied, setIsAllFilterApplied] = useState(false)

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getDueData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    const apiEndpoint = isAllFilterApplied
      ? `${apiBaseUrl}/dues/alltime/${storeId}`
      : `${apiBaseUrl}/dues/today/${storeId}`

    try {
      const response = await axios.get(`${apiEndpoint}`, { headers: { 'auth-token': token } })
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
    getDueData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllFilterApplied])

  const columns = useMemo<ColumnDef<DueAmountDataType, any>[]>(
    () => [
      // columnHelper.accessor('transactionId', {
      //   header: 'TransactionId',
      //   cell: ({ row }) => <Typography>{row.original.transactionId}</Typography>
      // }),
      columnHelper.accessor('fullName', {
        header: 'Customer Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ fullName: row.original.fullName })}
            <div className='flex flex-col'>
              <Typography
                component={Link}
                color='text.primary'
                href={getLocalizedUrl(`/staff/customer/details/${row.original._id}`, locale as Locale)}
                className='font-medium hover:text-primary'
              >
                {row.original.fullName}
              </Typography>
            </div>
          </div>
        )
      }),
      // columnHelper.accessor('description', {
      //   header: 'Description',
      //   cell: ({ row }) => <Typography>{row.original.description}</Typography>
      // }),
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
              getCustomerData: getDueData,
              customerData: {
                customerId: row.original._id,
                credit: Number(row.original.credit ?? 0) + Number(row.original.cafeCredit ?? 0)
              }
            }}
          />
        )
        // <Button className='border text-green-500' onClick={}>Pay</Button>
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as DueAmountDataType[],
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
          <Typography className='text-xl font-bold'>Dues</Typography>
          <div className='flex gap-x-4'>
            <ToggleButton
              value={isAllFilterApplied}
              color='success'
              size='small'
              selected={isAllFilterApplied}
              onChange={() => setIsAllFilterApplied(!isAllFilterApplied)}
            >
              All Time
            </ToggleButton>
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

export default DueAmountTable
