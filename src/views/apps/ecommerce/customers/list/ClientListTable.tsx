'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
import axios from 'axios'
import classnames from 'classnames'
import { toast } from 'react-toastify'

// Type Imports
import type { Client } from '@/types/apps/ecommerceTypes'
import type { ThemeColor } from '@core/types'

// Style Imports
import OptionMenu from '@/@core/components/option-menu/index'
import EditUserInfo from '@/components/dialogs/edit-user-info/index'
import RenewSubscription from '@/components/dialogs/renew-membership/index'

import tableStyles from '@core/styles/table.module.css'

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

type ECommerceOrderTypeWithAction = Client & {
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

// const DebouncedInput = ({
//   value: initialValue,
//   onChange,
//   debounce = 500,
//   ...props
// }: {
//   value: string | number
//   onChange: (value: string | number) => void
//   debounce?: number
// } & Omit<TextFieldProps, 'onChange'>) => {
//   // States
//   const [value, setValue] = useState(initialValue)

//   useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value])

//   return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
// }

// Column Definitions
const columnHelper = createColumnHelper<ECommerceOrderTypeWithAction>()

const ClientListTable = () => {
  // States
  //const [customerUserOpen, setCustomerUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as Client[])
  const [globalFilter, setGlobalFilter] = useState('')
  const [newRegistrationDialogOpen, setNewRegistrationDialogOpen] = useState(false)
  const [renewSubscriptionDialogOpen, setRenewSubscriptionDialogOpen] = useState(false)

  // Hooks
  //const { lang: locale } = useParams()

  const getClientData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/client/`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setData(response.data)
      }
    } catch (error: any) {
      toast(error?.response?.data ?? error?.message)
    }
  }

  useEffect(() => {
    getClientData()
  }, [])

  const columns = useMemo<ColumnDef<ECommerceOrderTypeWithAction, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      columnHelper.accessor('transactionId', {
        header: 'Transaction Id',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.transactionId}</Typography>
      }),
      columnHelper.accessor('registrationDate', {
        header: 'Registration Date',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.registrationDate}</Typography>
      }),
      columnHelper.accessor('storeId', {
        header: 'Store Id',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.storeId}</Typography>
      }),
      columnHelper.accessor('fullName', {
        header: 'Store Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.fullName}</Typography>
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.city}</Typography>
      }),
      columnHelper.accessor('contact', {
        header: 'Contact',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.contact}</Typography>
      }),
      columnHelper.accessor('subscription', {
        header: 'Subscription',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.subscription}</Typography>
      }),
      columnHelper.accessor('plan', {
        header: 'Plan',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.plan}</Typography>
      }),
      columnHelper.accessor('expiringOn', {
        header: 'Expiring On',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.expiringOn}</Typography>
      }),
      // columnHelper.accessor('status', {
      //   header: 'Status',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-3'>
      //       <Chip
      //         label={customerStatusObj[row.original.isActive ? 'Active' : 'Inactive'].title}
      //         variant='tonal'
      //         color={customerStatusObj[row.original.isActive ? 'Active' : 'Inactive'].color}
      //         size='small'
      //       />
      //     </div>
      //   )
      // }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* <IconButton size='small'>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton> */}
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
                    onClick: () => setData(data?.filter(product => product.id !== row.original.id))
                  }
                }

                // { text: 'Duplicate', icon: 'ri-stack-line', menuItemProps: { className: 'gap-2' } }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })

      // columnHelper.accessor('customer', {
      //   header: 'Customers',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-3'>
      //       {getAvatar({ avatar: row.original.avatar, customer: row.original.customer })}
      //       <div className='flex flex-col items-start'>
      //         <Typography
      //           component={Link}
      //           color='text.primary'
      //           href={getLocalizedUrl(`/apps/ecommerce/customers/details/${row.original.customerId}`, locale as Locale)}
      //           className='font-medium hover:text-primary'
      //         >
      //           {row.original.customer}
      //         </Typography>
      //         <Typography variant='body2'>{row.original.email}</Typography>
      //       </div>
      //     </div>
      //   )
      // }),
      // columnHelper.accessor('customerId', {
      //   header: 'Customer Id',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.customerId}</Typography>
      // }),
      // columnHelper.accessor('country', {
      //   header: 'Country',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-2'>
      //       <img src={row.original.countryFlag} height={22} />
      //       <Typography>{row.original.country}</Typography>
      //     </div>
      //   )
      // }),
      // columnHelper.accessor('order', {
      //   header: 'Orders',
      //   cell: ({ row }) => <Typography>{row.original.order}</Typography>
      // }),
      // columnHelper.accessor('totalSpent', {
      //   header: 'Total Spent',
      //   cell: ({ row }) => (
      //     <Typography className='font-medium' color='text.primary'>
      //       ${row.original.totalSpent.toLocaleString()}
      //     </Typography>
      //   )
      // })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as Client[],
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

  // const getAvatar = (params: Pick<Customer, 'avatar' | 'customer'>) => {
  //   const { avatar, customer } = params

  //   if (avatar) {
  //     return <CustomAvatar src={avatar} skin='light' size={34} />
  //   } else {
  //     return (
  //       <CustomAvatar skin='light' size={34}>
  //         {getInitials(customer as string)}
  //       </CustomAvatar>
  //     )
  //   }
  // }

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
              onClick={() => setNewRegistrationDialogOpen(!newRegistrationDialogOpen)}
            >
              New Registration
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setRenewSubscriptionDialogOpen(!renewSubscriptionDialogOpen)}
            >
              Renew Subscription
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
      <EditUserInfo open={newRegistrationDialogOpen} setOpen={setNewRegistrationDialogOpen} />
      <RenewSubscription open={renewSubscriptionDialogOpen} setOpen={setRenewSubscriptionDialogOpen} />
      {/* <AddCustomerDrawer
        open={customerUserOpen}
        handleClose={() => setCustomerUserOpen(!customerUserOpen)}
        setData={setData}
        clientData={data}
      /> */}
    </>
  )
}

export default ClientListTable
