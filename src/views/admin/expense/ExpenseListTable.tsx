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

import OptionMenu from '@/@core/components/option-menu'
import DeleteConfirmation from '@/components/dialogs/delete-confirmation'
import EditExpense from '@/components/dialogs/edit-expense'
import NewExpense from '@/components/dialogs/new-expense'
import SearchInput from '@/components/Search'
import { ExpenseDataType } from '@/types/adminTypes'
import tableStyles from '@core/styles/table.module.css'
import { Chip } from '@mui/material'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
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

type StatusChipDetailsType = {
  title: string
  color: ThemeColor
}

export const statusChipDetails: { [key: string]: StatusChipDetailsType } = {
  Paid: { title: 'Paid', color: 'success' },
  Due: { title: 'Due', color: 'error' },
  'Partial Due': { title: 'Partial Due', color: 'warning' }
}

type ExpenseDataWithAction = ExpenseDataType & {
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

const columnHelper = createColumnHelper<ExpenseDataWithAction>()

const ExpenseListTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as ExpenseDataType[])
  const [expenseData, setExpenseData] = useState({} as ExpenseDataType)
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [newExpenseDialogOpen, setNewExpenseDialogOpen] = useState(false)
  const [editExpenseDialogOpen, setEditExpenseDialogOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getAllExpenseData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/expense`, { headers: { 'auth-token': token } })
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
    getAllExpenseData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteExpense = async () => {
    const expenseId = expenseData._id
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`${apiBaseUrl}/expense/${expenseId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        getAllExpenseData()
        setDeleteConfirmationDialogOpen(false)
        toast.success('Expense deleted successfully')
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const openDeleteConfirmation = (Product: ExpenseDataType) => {
    setExpenseData(Product)
    setDeleteConfirmationDialogOpen(true)
  }

  const editExpenseData = (rowData: ExpenseDataType) => {
    setExpenseData(rowData)
    setEditExpenseDialogOpen(!editExpenseDialogOpen)
  }

  // const getAvatar = (params: { image: string; name: string }) => {
  //   const { image, name } = params

  //   if (image && image !== '-') {
  //     return <CustomAvatar src={image} skin='light' size={34} />
  //   } else {
  //     return (
  //       <CustomAvatar skin='light' size={34}>
  //         {getInitials(name as string)}
  //       </CustomAvatar>
  //     )
  //   }
  // }

  const columns = useMemo<ColumnDef<ExpenseDataWithAction, any>[]>(
    () => [
      // columnHelper.accessor('productName', {
      //   header: 'Product',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-4'>
      //       {getAvatar({ image: row.original.productImage, name: row.original.productName })}
      //       <div className='flex flex-col'>
      //         <Typography className='font-medium' color='text.primary'>
      //           {row.original.productName}
      //         </Typography>
      //         <Typography variant='body2'>{row.original.description}</Typography>
      //       </div>
      //     </div>
      //   )
      // }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.date ? DateTime.fromISO(row.original.date).toFormat('dd LLL yyyy') : ''}
          </Typography>
        )
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.category?.name}</Typography>
      }),
      columnHelper.accessor('invoiceNumber', {
        header: 'Invoice No',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.invoiceNumber}</Typography>
      }),
      columnHelper.accessor('vendorName', {
        header: 'Vendor Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.vendorName}</Typography>
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.description}</Typography>
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.amount}</Typography>
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.quantity}</Typography>
      }),
      columnHelper.accessor('invoiceAmount', {
        header: 'Total',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.invoiceAmount}</Typography>
      }),
      columnHelper.accessor('note', {
        header: 'Note',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.note}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {statusChipDetails[row.original.status]?.title ? (
              <Chip
                label={statusChipDetails[row.original.status]?.title}
                variant='tonal'
                color={statusChipDetails[row.original.status]?.color}
                size='small'
              />
            ) : (
              <></>
            )}
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' onClick={() => editExpenseData(row.original)}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                // { text: 'Download', icon: 'ri-download-line', menuItemProps: { className: 'gap-2' } },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => openDeleteConfirmation(row.original)
                  }
                }

                // { text: 'Duplicate', icon: 'ri-stack-line', menuItemProps: { className: 'gap-2' } }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as ExpenseDataType[],
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
          <SearchInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
            //className='is-full sm:is-auto'
          />

          <div className='flex gap-x-4'>
            {/* <Button variant='outlined' color='secondary' startIcon={<i className='ri-upload-2-line' />}>
              Export
            </Button> */}
            <Button
              variant='contained'
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={() => setNewExpenseDialogOpen(true)}
            >
              Add Expense
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
      <DeleteConfirmation
        open={deleteConfirmationDialogOpen}
        name={`Expense invoice (${expenseData.invoiceNumber})`}
        setOpen={setDeleteConfirmationDialogOpen}
        deleteApiCall={deleteExpense}
      />
      <NewExpense open={newExpenseDialogOpen} setOpen={setNewExpenseDialogOpen} getAllExpenseData={getAllExpenseData} />
      <EditExpense
        open={editExpenseDialogOpen}
        setOpen={setEditExpenseDialogOpen}
        getAllExpenseData={getAllExpenseData}
        expenseData={expenseData}
      />
    </>
  )
}

export default ExpenseListTable
