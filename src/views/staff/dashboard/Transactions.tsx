//MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import { DashboardDataType } from '@/types/staffTypes'
import CustomAvatar from '@core/components/mui/Avatar'

type DataType = {
  icon: string
  id: 'cash' | 'card' | 'upi' | 'prime'
  title: string
  color: ThemeColor
}

// Vars
const transactionData: DataType[] = [
  {
    id: 'cash',
    title: 'Cash',
    color: 'primary',
    icon: 'ri-pie-chart-2-line'
  },
  {
    id: 'card',
    title: 'Card',
    color: 'success',
    icon: 'ri-group-line'
  },
  {
    id: 'upi',
    color: 'warning',
    title: 'UPI',
    icon: 'ri-macbook-line'
  },
  {
    id: 'prime',
    color: 'info',
    title: 'Prime',
    icon: 'ri-money-dollar-circle-line'
  }
]

const Transactions = ({ data }: { data: DashboardDataType }) => {
  return (
    <Card className='bs-full'>
      <CardHeader
        title='Transactions'
        //action={<OptionMenu iconClassName='text-textPrimary' options={['Refresh', 'Share', 'Update']} />}
        // subheader={
        //   <p className='mbs-3'>
        //     <span className='font-medium text-textPrimary'>Total 48.5% Growth 😎</span>
        //     <span className='text-textSecondary'>this month</span>
        //   </p>
        // }
      />
      <CardContent className='!pbs-5'>
        <Grid container spacing={2}>
          {transactionData.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <div className='flex items-center gap-2'>
                <CustomAvatar variant='rounded' color={item.color} className='shadow-xs'>
                  <i className={item.icon}></i>
                </CustomAvatar>
                <div>
                  <Typography>{item.title}</Typography>
                  <Typography variant='h6'>{`₹${data.transactions?.[item.id] || 0}`}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Transactions
