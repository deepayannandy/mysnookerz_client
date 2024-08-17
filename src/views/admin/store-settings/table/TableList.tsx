'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
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

import Chip from '@mui/material/Chip'

// Type Imports
import type { ThemeColor } from '@core/types'

// Style Imports
import OptionMenu from '@/@core/components/option-menu/index'

import DeleteConfirmation from '@/components/dialogs/delete-confirmation'
import EditTableInfo from '@/components/dialogs/edit-table-info'
import NewTableCreation from '@/components/dialogs/new-table-creation'
import { TableDataType } from '@/types/adminTypes'
import tableStyles from '@core/styles/table.module.css'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type TableStatusType = {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const customerStatusObj: TableStatusType = {
  occupied: { title: 'Occupied', color: 'success' },
  booked: { title: 'Booked', color: 'primary' },
  idle: { title: 'Idle', color: 'error' }
}

type TableTypeWithAction = TableDataType & {
  status: string
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
const columnHelper = createColumnHelper<TableTypeWithAction>()

const TableList = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as TableDataType[])
  const [tableData, setTableData] = useState({} as TableDataType)
  const [globalFilter, setGlobalFilter] = useState('')
  const [newTableCreationDialogOpen, setNewTableCreationDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [editTableInfoDialogOpen, setEditTableInfoDialogOpen] = useState(false)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getTableData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/table`, { headers: { 'auth-token': token } })
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
    getTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteTable = async () => {
    const tableId = tableData._id
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`${apiBaseUrl}/table/${tableId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        getTableData()
        setDeleteConfirmationDialogOpen(false)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const openDeleteConfirmation = (table: TableDataType) => {
    setTableData(table)
    setDeleteConfirmationDialogOpen(true)
  }

  const editTableData = (rowData: TableDataType) => {
    setTableData(rowData)
    setEditTableInfoDialogOpen(!editTableInfoDialogOpen)
  }

  const columns = useMemo<ColumnDef<TableTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('tableName', {
        header: 'Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.tableName}</Typography>
      }),
      columnHelper.accessor('gameTypes', {
        header: 'Billing Types',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.gameTypes?.join(',')}</Typography>
      }),
      columnHelper.accessor('deviceId', {
        header: 'Device',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.deviceId}</Typography>
      }),
      columnHelper.accessor('nodeID', {
        header: 'Node',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.nodeID}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              label={
                customerStatusObj[row.original.isOccupied ? 'occupied' : row.original.isBooked ? 'booked' : 'idle']
                  ?.title
              }
              variant='tonal'
              color={
                customerStatusObj[row.original.isOccupied ? 'occupied' : row.original.isBooked ? 'booked' : 'idle']
                  ?.color
              }
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' onClick={() => editTableData(row.original)}>
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
    data: data as TableDataType[],
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
        <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-end gap-y-4'>
          <Typography className='text-xl font-bold'>Tables</Typography>
          <div className='flex gap-x-4'>
            <Button
              variant='contained'
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={() => setNewTableCreationDialogOpen(!newTableCreationDialogOpen)}
            >
              Add Table
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
      <NewTableCreation
        open={newTableCreationDialogOpen}
        setOpen={setNewTableCreationDialogOpen}
        getTableData={getTableData}
      />
      <EditTableInfo
        open={editTableInfoDialogOpen}
        setOpen={setEditTableInfoDialogOpen}
        getTableData={getTableData}
        tableData={tableData}
      />
      <DeleteConfirmation
        open={deleteConfirmationDialogOpen}
        name={`table (${tableData.tableName})`}
        setOpen={setDeleteConfirmationDialogOpen}
        deleteApiCall={deleteTable}
      />
    </>
  )
}

export default TableList
