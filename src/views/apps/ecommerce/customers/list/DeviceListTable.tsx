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
import { DateTime } from 'luxon'
import { toast } from 'react-toastify'

import Chip from '@mui/material/Chip'

// Type Imports
import type { Device } from '@/types/apps/ecommerceTypes'
import type { ThemeColor } from '@core/types'

// Component Imports

// Util Imports

// Style Imports
import OptionMenu from '@/@core/components/option-menu/index'

import DeviceDetailsDialog from '@/components/dialogs/device-details-dialog'
import tableStyles from '@core/styles/table.module.css'
import { useParams, usePathname, useRouter } from 'next/navigation'

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

type DeviceStatusType = {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

export const paymentStatus: { [key: number]: PayementStatusType } = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}

const deviceStatusObj: DeviceStatusType = {
  Active: { title: 'Active', color: 'success' },
  Idle: { title: 'Idle', color: 'warning' },
  Inactive: { title: 'Inactive', color: 'error' }
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

type ECommerceOrderTypeWithAction = Device & {
  actions?: string
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

const DeviceListTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as Device[])
  const [globalFilter, setGlobalFilter] = useState('')
  const [showDeviceDetailsDialog, setShowDeviceDetailsDialog] = useState(false)
  const [deviceDetailsData, setDeviceDetailsData] = useState({})

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getDeviceData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/devices/`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getDeviceData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeviceStatus = async (id: number, isActive: boolean) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/devices/${id}`,
        {
          isActive
        },
        {
          headers: { 'auth-token': token }
        }
      )
      if (response && response.data) {
        await getDeviceData()
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
  }

  // Hooks
  //const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<Device, any>[]>(
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
      columnHelper.accessor('serialNumber', {
        header: 'Serial Number',
        cell: ({ row }) => <Typography color='text.primary'>{row.original._id}</Typography>
      }),
      columnHelper.accessor('onboarding', {
        header: 'Activation Date',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.onboarding}</Typography>
      }),
      columnHelper.accessor('deviceId', {
        header: 'MAC Id',
        cell: ({ row }) => (
          <Typography
            component={Button}
            color='text.primary'
            className='font-medium hover:text-primary'
            onClick={() => handleDeviceDetails(row.original)}
          >
            {row.original.deviceId}
          </Typography>
        )
      }),
      columnHelper.accessor('storeId', {
        header: 'Store Id',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.storeId}</Typography>
      }),
      columnHelper.accessor('warrantyExpiryDate', {
        header: 'Warranty Date',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.warrantyExpiryDate}</Typography>
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              label={deviceStatusObj[row.original.isActive ? 'Active' : 'Inactive'].title}
              variant='tonal'
              color={deviceStatusObj[row.original.isActive ? 'Active' : 'Inactive'].color}
              size='small'
            />
          </div>
        )
      }),
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
                {
                  text: 'Activate',
                  icon: 'ri-eye-line',
                  menuItemProps: { className: 'gap-2', onClick: () => handleDeviceStatus(row.original._id, true) }
                },

                // { text: 'Download', icon: 'ri-download-line', menuItemProps: { className: 'gap-2' } },
                {
                  text: 'De-Activate',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => handleDeviceStatus(row.original._id, false)
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
    data: data as Device[],
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

  const handleDeviceDetails = (rowData: Device) => {
    const warrantyAvailingDate = rowData.warrantyAvailingDate?.map((date: string) =>
      DateTime.fromISO(date).toFormat('dd LLL yyyy')
    )

    setDeviceDetailsData({
      id: rowData._id,
      macId: rowData.deviceId,
      activationDate: rowData.onboarding ? DateTime.fromISO(rowData.onboarding).toFormat('dd LLL yyyy') : '',
      warrantyExpiryDate: rowData.warrantyExpiryDate
        ? DateTime.fromISO(rowData.warrantyExpiryDate).toFormat('dd LLL yyyy')
        : '',
      warrantyAvailingDate: warrantyAvailingDate?.length ? warrantyAvailingDate : []
    })
    setShowDeviceDetailsDialog(!showDeviceDetailsDialog)
  }

  return (
    <>
      <Card>
        <CardContent className='flex justify-between flex-col items-start sm:flex-col sm:items-end gap-y-4'>
          {/* <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
          /> */}
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
      <DeviceDetailsDialog
        open={showDeviceDetailsDialog}
        setOpen={setShowDeviceDetailsDialog}
        deviceDetailData={deviceDetailsData}
        setDeviceDetailsData={setDeviceDetailsData}
        getDeviceData={getDeviceData}
      />
    </>
  )
}

export default DeviceListTable
