'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import BillPreviewCard, { CustomerInvoiceType } from '@/views/staff/booking/BillPreviewCard'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

type TableBillPropType = {
  open: boolean
  setOpen: (open: boolean) => void
  tableName: string
}

const data = [
  {
    timeDescription: 'First 15 minutes',
    total: 30
  },
  {
    timeDescription: '45 minutes',
    total: 90
  }
]

const invoiceData: CustomerInvoiceType = {
  customers: ['Mrinal', 'Deep', 'Nandy'],
  tableName: 'Table-1',
  startTime: '2023-07-31T10:59:58Z',
  endTime: '2023-07-31T11:59:58Z',
  amountData: data,
  subTotal: 120,
  tax: 10,
  total: 132,
  storeName: 'ABC',
  city: 'Mumbai',
  state: 'Maharastra',
  country: 'INDIA'
}

const TableBill = ({ open, setOpen }: TableBillPropType) => {
  // States
  //const [userData, setUserData] = useState<EditUserInfoProps['data']>(data)
  const [data, setData] = useState(invoiceData)

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const handleClose = () => {
    setData({ ...data, discount: null, paymentMethod: '' })
    setOpen(false)
  }

  const handleSubmit = () => {
    console.log(data)
    setOpen(false)
    // const data = new FormData(event.currentTarget)
    // const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    // try {
    //   const response = await axios.post(`${apiBaseUrl}/user/register`, data)

    //   if (response && response.data) {
    //     //getClientData()
    //     setOpen(false)
    //   }
    // } catch (error: any) {
    //   if (error?.response?.status === 400) {
    //     const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
    //     return router.replace(redirectUrl)
    //   }
    //   toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    // }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Bill</div>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>
        <Grid container spacing={5}>
          <Grid item xs={12} md={12}>
            <BillPreviewCard data={data} setData={setData} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={handleSubmit}>
          Checkout
        </Button>
        <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TableBill
