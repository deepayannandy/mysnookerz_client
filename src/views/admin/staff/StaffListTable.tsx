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

import CustomAvatar from '@/@core/components/mui/Avatar'
import EditStaffInfo from '@/components/dialogs/ edit-staff-info'
import NewStaffRegistration from '@/components/dialogs/ new-staff-registration'
import { StaffDataType } from '@/types/adminTypes'
import { getInitials } from '@/utils/getInitials'
import tableStyles from '@core/styles/table.module.css'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
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

type StatusChipColorType = {
  color: ThemeColor
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Active: { color: 'success' },
  InActive: { color: 'error' }
}

type StaffDataWithAction = StaffDataType & {
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

const columnHelper = createColumnHelper<StaffDataWithAction>()

const StaffListTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as StaffDataType[])
  const [staffData, setStaffData] = useState({} as StaffDataType)
  const [globalFilter, setGlobalFilter] = useState('')
  const [newStaffRegistrationDialogOpen, setNewStaffRegistrationDialogOpen] = useState(false)
  const [editStaffInfoDialogOpen, setEditStaffInfoDialogOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getStaffData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/user/getMyStaffs`, { headers: { 'auth-token': token } })
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
    getStaffData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAvatar = (params: Pick<StaffDataType, 'profileImage' | 'fullName'>) => {
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

  const editStaffData = (rowData: StaffDataType) => {
    setStaffData(rowData)
    setEditStaffInfoDialogOpen(!editStaffInfoDialogOpen)
  }

  const columns = useMemo<ColumnDef<StaffDataWithAction, any>[]>(
    () => [
      columnHelper.accessor('fullName', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ profileImage: row.original.profileImage, fullName: row.original.fullName })}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.fullName}
              </Typography>
              {/* <Typography variant='body2'>{row.original.fu}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('mobile', {
        header: 'Mobile',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.mobile}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.email}</Typography>
      }),
      columnHelper.accessor('onBoardingDate', {
        header: 'Boarding Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.onBoardingDate ? DateTime.fromISO(row.original.onBoardingDate).toFormat('dd LLL yyyy') : ''}
          </Typography>
        )
      }),
      columnHelper.accessor('userStatus', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              label={row.original.userStatus ? 'Active' : 'In Active'}
              variant='tonal'
              color={statusChipColor[row.original.userStatus ? 'Active' : 'Inactive']?.color}
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' onClick={() => editStaffData(row.original)}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            {/* <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                // { text: 'Download', icon: 'ri-download-line', menuItemProps: { className: 'gap-2' } },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => setData(data?.filter(product => product._id !== row.original._id))
                  }
                }

                // { text: 'Duplicate', icon: 'ri-stack-line', menuItemProps: { className: 'gap-2' } }
              ]}
            /> */}
          </div>
        ),
        enableSorting: false
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
              Add Staff
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
      <EditStaffInfo
        open={editStaffInfoDialogOpen}
        setOpen={setEditStaffInfoDialogOpen}
        getStaffData={getStaffData}
        staffData={staffData}
      />
    </>
  )
}

export default StaffListTable
