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

// Style Imports

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { CreditReportTableDataType } from '@/types/adminTypes'
import tableStyles from '@core/styles/table.module.css'
import * as mui from '@mui/material'
import { Button, CardContent, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DateTime } from 'luxon'

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

const columnHelper = createColumnHelper<CreditReportTableDataType>()

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<mui.TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const storeName = localStorage.getItem('storeName')

const paymentMethods = ['CASH', 'CARD', 'UPI']

const CreditReportTable = ({
  data,
  getReportData
}: {
  data: CreditReportTableDataType[]
  getReportData: (dates?: { startDate: string; endDate: string }) => void
}) => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isTodayFilterApplied, setIsTodayFilterApplied] = useState(false)
  const [isLastMonthFilterApplied, setIsLastMonthFilterApplied] = useState(false)
  const [startDate, setStartDate] = useState(null as Date | null)
  const [endDate, setEndDate] = useState(null as Date | null)
  const [isDateFilterApplied, setIsDateFilterApplied] = useState(false)
  const [selectedStoreName, setSelectedStoreName] = useState(storeName)
  const [paymentMethodFilter, setPaymentMethodFilter] = useState([] as string[])
  const [creditData, setCreditData] = useState(data)

  useEffect(() => {
    setCreditData(data)
  }, [data])

  const getPaymentMethod = (rowData: CreditReportTableDataType): string => {
    if (!rowData.received) {
      return 'DUE'
    }

    const descriptionArr = rowData.description?.split(' ')
    if (descriptionArr?.length) {
      const method = descriptionArr[descriptionArr.length - 1]
      return paymentMethods.includes(method) ? method : ''
    }
    return ''
  }

  const getDescription = (description: string): string => {
    const descriptionArr = description?.split(' ')
    if (descriptionArr?.length) {
      const method = descriptionArr[descriptionArr.length - 1]
      return paymentMethods.includes(method)
        ? (descriptionArr.slice(0, descriptionArr.length - 1)?.join(' ') ?? '')
        : description
    }
    return description
  }

  const columns = useMemo<ColumnDef<CreditReportTableDataType, any>[]>(
    () => [
      columnHelper.accessor('transactionId', {
        header: 'Transaction ID',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.transactionId}</Typography>
      }),
      columnHelper.accessor('date', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {DateTime.fromISO(row.original.date).toFormat('dd LLL yyyy hh:mm:ss a')}
          </Typography>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Typography color='text.primary'>{getDescription(row.original.description)}</Typography>
      }),
      columnHelper.accessor('netPay', {
        header: 'Net Pay',
        cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.netPay || 0}`}</Typography>
      }),
      columnHelper.accessor('credit', {
        header: 'Dues',
        cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.credit || 0}`}</Typography>
      }),
      columnHelper.accessor('received', {
        header: 'Received',
        cell: ({ row }) => <Typography color='text.primary'>{`₹${row.original.received || 0}`}</Typography>
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Payment Method',
        cell: ({ row }) => <Typography color='text.primary'>{getPaymentMethod(row.original)}</Typography>
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: creditData as CreditReportTableDataType[],
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

  const applyDateFilters = (value?: { today?: boolean; lastMonth?: boolean; clearAll?: boolean }) => {
    if (value?.clearAll) {
      setStartDate(null)
      setEndDate(null)
      setIsTodayFilterApplied(false)
      setIsLastMonthFilterApplied(false)
      setIsDateFilterApplied(false)
      getReportData()
    } else if (value?.today) {
      setIsTodayFilterApplied(true)
      setIsLastMonthFilterApplied(false)
      setIsDateFilterApplied(true)
      setStartDate(null)
      setEndDate(null)
      getReportData({
        startDate: DateTime.now().toFormat('yyyy-MM-dd'),
        endDate: DateTime.now().toFormat('yyyy-MM-dd')
      })
    } else if (value?.lastMonth) {
      setIsLastMonthFilterApplied(true)
      setIsTodayFilterApplied(false)
      setIsDateFilterApplied(true)
      setStartDate(null)
      setEndDate(null)
      getReportData({
        startDate: DateTime.now().minus({ months: 1 }).startOf('month').toFormat('yyyy-MM-dd'),
        endDate: DateTime.now().minus({ months: 1 }).endOf('month').toFormat('yyyy-MM-dd')
      })
    } else if (startDate && endDate) {
      setIsTodayFilterApplied(false)
      setIsLastMonthFilterApplied(false)
      setIsDateFilterApplied(true)
      getReportData({
        startDate: DateTime.fromJSDate(startDate).toFormat('yyyy-MM-dd'),
        endDate: DateTime.fromJSDate(endDate).toFormat('yyyy-MM-dd')
      })
    }
    // const startDate = ''
    // const endDate = ''
    // getReportData({ startDate, endDate })
  }

  const applyFilter = (filterValue: string | string[]) => {
    const filterValuesArray = typeof filterValue === 'string' ? filterValue.split(',') : filterValue
    setPaymentMethodFilter(filterValuesArray)

    if (filterValuesArray.length) {
      const filteredData = data.filter(reportData => {
        const descriptionArr = reportData.description?.split(' ')
        if (descriptionArr?.length) {
          const paymentMethod = descriptionArr[descriptionArr.length - 1]

          return filterValuesArray.some(value => paymentMethod.includes(value) && reportData.received)
        }

        return false
      })

      setCreditData(filteredData)
    } else if (data.length) {
      setCreditData(data)
    }
  }

  return (
    <>
      <Card>
        <CardContent className='flex gap-3 flex-wrap flex-col sm:flex-row'>
          <Button
            disabled={isTodayFilterApplied}
            variant='contained'
            component={Button}
            onClick={() => applyDateFilters({ today: true })}
          >
            Today
          </Button>
          <Button
            disabled={isLastMonthFilterApplied}
            variant='contained'
            component={Button}
            onClick={() => applyDateFilters({ lastMonth: true })}
          >
            Last Month
          </Button>
          <div className='flex flex-col sm:flex-row items-center gap-2'>
            <AppReactDatepicker
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={40}
              placeholderText='DD/MM/YYYY'
              dateFormat={'dd/MM/yyyy'}
              selected={startDate as Date}
              onChange={date => setStartDate(date)}
              customInput={<TextField size='small' value={startDate} fullWidth label='Start Date' />}
            />
            <AppReactDatepicker
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={40}
              placeholderText='DD/MM/YYYY'
              dateFormat={'dd/MM/yyyy'}
              selected={endDate as Date}
              onChange={date => setEndDate(date)}
              customInput={<TextField size='small' value={endDate} fullWidth label='End Date' />}
            />
            <Button
              disabled={!(startDate && endDate)}
              variant='contained'
              component={Button}
              onClick={() => applyDateFilters({ today: false })}
              className='max-sm:is-full'
            >
              Apply
            </Button>
          </div>
          <Button
            disabled={!isDateFilterApplied}
            variant='contained'
            component={Button}
            onClick={() => applyDateFilters({ clearAll: true })}
          >
            Clear Filters
          </Button>
          <DebouncedInput
            size='small'
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Transaction Id'
          />
          <FormControl className='sm:w-40' size='small'>
            <InputLabel id='status-select'>Store Name</InputLabel>
            <Select
              size='small'
              id='select-status'
              value={selectedStoreName ?? ''}
              onChange={e => setSelectedStoreName(e.target.value)}
              label='Store Name'
              labelId='store-select'
            >
              <MenuItem value={storeName ?? ''}>{storeName}</MenuItem>
            </Select>
          </FormControl>
          {/* <DebouncedInput
            size='small'
            value={paymentMethodFilter}
            onChange={value => applyFilter(value as string)}
            placeholder='Payment Method'
          /> */}
          <FormControl size='small'>
            <InputLabel>Payment Method</InputLabel>
            {/* <NativeSelect
              id='demo-customized-select-native'
              value={paymentMethodFilter}
              onChange={event => applyFilter(event.target.value)}
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </NativeSelect> */}
            <Select
              size='small'
              className='sm:w-44'
              label='Payment Method'
              multiple
              value={paymentMethodFilter}
              onChange={event => applyFilter(event.target.value)}
              renderValue={selected => selected.map(value => value).join(', ')}
            >
              {paymentMethods.map(method => (
                <MenuItem key={method} value={method}>
                  <Checkbox checked={paymentMethodFilter.indexOf(method) > -1} />
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default CreditReportTable
