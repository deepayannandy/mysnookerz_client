'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
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
import type { ThemeColor } from '@core/types'

// Style Imports

import CustomAvatar from '@/@core/components/mui/Avatar'
import OptionMenu from '@/@core/components/option-menu'
import BlacklistConfirmation from '@/components/dialogs/blacklist-confirmation'
import DeleteConfirmation from '@/components/dialogs/delete-confirmation'
import EditCustomerInfo from '@/components/dialogs/edit-customer-info'
import NewCustomerRegistration from '@/components/dialogs/new-customer-registration'
import SearchInput from '@/components/Search'
import { Locale } from '@/configs/i18n'
import { CustomerDataType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'
import tableStyles from '@core/styles/table.module.css'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import * as matchSortedUtils from '@tanstack/match-sorter-utils'
import axios from 'axios'
import Link from 'next/link'
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

type CustomerDataWithAction = CustomerDataType & {
  actions?: string
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

const columnHelper = createColumnHelper<CustomerDataWithAction>()

const CustomerListTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as CustomerDataType[])
  const [customerData, setCustomerData] = useState({} as CustomerDataType)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [newCustomerRegistrationDialogOpen, setNewCustomerRegistrationDialogOpen] = useState(false)
  const [editCustomerInfoDialogOpen, setEditCustomerInfoDialogOpen] = useState(false)
  const [blacklistConfirmationDialogOpen, setBlacklistConfirmationDialogOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getCustomerData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/customer/myCustomers`, { headers: { 'auth-token': token } })
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
    getCustomerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteCustomer = async () => {
    const customerId = customerData._id
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`${apiBaseUrl}/customer/${customerId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        getCustomerData()
        setDeleteConfirmationDialogOpen(false)
        toast.success('Customer deleted successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const blacklistCustomer = async (reason: string) => {
    const customerId = customerData._id
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/customer/${customerId}`,
        { isBlackListed: true, reasonOfBlackList: reason },
        { headers: { 'auth-token': token } }
      )
      if (response && response.data) {
        getCustomerData()
        setBlacklistConfirmationDialogOpen(false)
        toast.success('Customer blacklisted successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const openDeleteConfirmation = (customer: CustomerDataType) => {
    setCustomerData(customer)
    setDeleteConfirmationDialogOpen(true)
  }

  const openBlacklistConfirmation = (customer: CustomerDataType) => {
    if (customer.isBlackListed) {
      toast.error('Customer is already blacklisted', { hideProgressBar: false })
    } else {
      setCustomerData(customer)
      setBlacklistConfirmationDialogOpen(true)
    }
  }

  const editCustomerData = (rowData: CustomerDataType) => {
    setCustomerData(rowData)
    setEditCustomerInfoDialogOpen(!editCustomerInfoDialogOpen)
  }

  const getAvatar = (params: Pick<CustomerDataType, 'profileImage' | 'fullName'>) => {
    const { profileImage, fullName } = params

    if (profileImage && profileImage !== '-') {
      return <CustomAvatar src={profileImage} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName as string)}
        </CustomAvatar>
      )
    }
  }

  const columns = useMemo<ColumnDef<CustomerDataWithAction, any>[]>(
    () => [
      columnHelper.accessor('fullName', {
        header: 'Customer Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ profileImage: row.original.profileImage, fullName: row.original.fullName })}
            <div className='flex flex-col'>
              <Typography
                component={Link}
                color='text.primary'
                href={getLocalizedUrl(`/staff/customer/details/${row.original._id}`, locale as Locale)}
                className='font-medium hover:text-primary'
              >
                {row.original.fullName}
              </Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        )
      }),
      // columnHelper.accessor('fullName', {
      //   header: 'Customer Name',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.fullName}</Typography>
      // }),
      columnHelper.accessor('contact', {
        header: 'Mobile',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.contact}</Typography>
      }),
      columnHelper.accessor('rewards', {
        header: 'Rewards',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.rewards}</Typography>
      }),
      columnHelper.accessor('credit', {
        header: 'Credit',
        cell: ({ row }) => (
          <Typography color='text.primary'>{`₹${row.original.credit ? row.original.credit.toFixed(2) : 0}`}</Typography>
        )
      }),
      // columnHelper.accessor('status', {
      //   header: 'Status',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-3'>
      //       <Chip
      //         label={row.original.status}
      //         variant='tonal'
      //         color={statusChipColor[row.original.status]?.color}
      //         size='small'
      //       />
      //     </div>
      //   )
      // }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' onClick={() => editCustomerData(row.original)}>
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
                },
                {
                  text: 'Blacklist',
                  icon: 'ri-stack-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => openBlacklistConfirmation(row.original)
                  }
                }
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
    data: data as CustomerDataType[],
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
              onClick={() => setNewCustomerRegistrationDialogOpen(!newCustomerRegistrationDialogOpen)}
            >
              Add Customer
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
      <NewCustomerRegistration
        open={newCustomerRegistrationDialogOpen}
        setOpen={setNewCustomerRegistrationDialogOpen}
        getCustomerData={getCustomerData}
      />
      <EditCustomerInfo
        open={editCustomerInfoDialogOpen}
        setOpen={setEditCustomerInfoDialogOpen}
        getCustomerData={getCustomerData}
        customerData={customerData}
      />
      <DeleteConfirmation
        open={deleteConfirmationDialogOpen}
        name={`customer (${customerData.fullName})`}
        setOpen={setDeleteConfirmationDialogOpen}
        deleteApiCall={deleteCustomer}
      />
      <BlacklistConfirmation
        open={blacklistConfirmationDialogOpen}
        setOpen={setBlacklistConfirmationDialogOpen}
        api={blacklistCustomer}
      />
    </>
  )
}

export default CustomerListTable
