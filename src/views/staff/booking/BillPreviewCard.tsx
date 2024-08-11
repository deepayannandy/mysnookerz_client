// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Type Imports

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import { TableDataType } from '@/types/adminTypes'
import { CustomerInvoiceType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import tableStyles from '@core/styles/table.module.css'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import * as muiCreateTheme from '@mui/material/styles/createTheme'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { DateTime } from 'luxon'

const paymentMethods = ['CASH', 'UPI', 'CARD']

const BillPreviewCard = ({
  tableData,
  inputData,
  setInputData,
  data
}: {
  tableData: TableDataType
  inputData: { discount?: number | null; paymentMethod: string }
  setInputData: (value: { discount?: number | null; paymentMethod: string }) => void
  data: CustomerInvoiceType
  setData?: (value: CustomerInvoiceType) => void
}) => {
  const isBelowMdScreen = useMediaQuery((theme: muiCreateTheme.Theme) => theme.breakpoints.down('md'))

  return (
    <Card className='billPreviewCard'>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center'>
                    <Logo />
                  </div>
                  {/* <div>
                    <Typography color='text.primary'>{data.storeName}</Typography>
                    <Typography color='text.primary'>{`${data.city}, ${data.state}`}</Typography>
                    <Typography color='text.primary'>{data.country}</Typography>
                  </div> */}
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Invoice ${tableData.tableName}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{`Start Time: ${DateTime.fromISO(data.selectedTable?.gameData?.startTime).toFormat('dd-MMM-yyyy HH:mm:ss a')}`}</Typography>
                    <Typography color='text.primary'>{`End Time: ${DateTime.fromISO(data.selectedTable?.gameData?.endTime).toFormat('dd-MMM-yyyy HH:mm:ss a')}`}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={12}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    {data.selectedTable?.gameData?.players?.map(player => (
                      <Chip
                        key={player.fullName}
                        avatar={<Avatar>{getInitials(player.fullName)}</Avatar>}
                        label={player.fullName}
                        variant='outlined'
                      />
                    ))}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className='overflow-x-auto border rounded'>
              <table className={tableStyles.table}>
                <thead>
                  <tr className='border-be'>
                    <th className='!bg-transparent'>Title</th>
                    <th className='!bg-transparent'>Time</th>
                    <th className='!bg-transparent'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.billBreakup?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Typography color='text.primary'>{item.title}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{item.time}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{item.amount}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-[unset]'>
                {/* <div className='flex items-center gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Return:
                  </Typography>
                  <TextField
                    {...(isBelowMdScreen && { fullWidth: true })}
                    size='small'
                    inputProps={{ type: 'number', min: 0 }}
                    placeholder='Return'
                    className='w-28'
                    value={data.return}
                    onChange={event =>
                      setData({ ...data, return: Number(event.target.value) ? Number(event.target.value) : null })
                    }
                  />
                </div> */}
                <div className='flex items-center gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Discount:
                  </Typography>
                  <TextField
                    {...(isBelowMdScreen && { fullWidth: true })}
                    size='small'
                    inputProps={{ type: 'number', min: 0 }}
                    placeholder='Discount'
                    className='w-28'
                    value={inputData.discount}
                    onChange={event =>
                      setInputData({
                        ...inputData,
                        discount: Number(event.target.value) ? Number(event.target.value) : null
                      })
                    }
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Payment Method:
                  </Typography>
                  <Select
                    className='is-1/2 min-is-[220px] sm:is-auto'
                    size='small'
                    value={inputData.paymentMethod}
                    onChange={e => {
                      setInputData({ ...inputData, paymentMethod: e.target.value })
                    }}
                  >
                    {paymentMethods.map((paymentMethod, index) => (
                      <MenuItem key={index} value={paymentMethod.toLowerCase().replace(/\s+/g, '-')}>
                        {paymentMethod}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className='min-is-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹ {data.totalBillAmt}
                  </Typography>
                </div>
                {inputData.discount ? (
                  <div className='flex items-center justify-between'>
                    <Typography>Discount:</Typography>
                    <Typography className='font-medium' color='text.primary'>
                      ₹ {inputData.discount}
                    </Typography>
                  </div>
                ) : (
                  <></>
                )}

                {/* <div className='flex items-center justify-between'>
                  <Typography>Tax:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    {data.tax}%
                  </Typography>
                </div> */}
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    {/* + (data.totalBillAmt - (data.discount ?? 0) * data.tax) / 100} */}₹{' '}
                    {data.totalBillAmt - (inputData.discount ?? 0)}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              It was a pleasure serving you. Thank You!
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BillPreviewCard
