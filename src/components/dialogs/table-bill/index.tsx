'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { TableDataType } from '@/types/adminTypes'
import { CustomerInvoiceType } from '@/types/staffTypes'
import BillPreviewCard from '@/views/staff/booking/BillPreviewCard'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import { toast } from 'react-toastify'

type TableBillPropType = {
  open: boolean
  setOpen: (open: boolean) => void
  tableData: TableDataType
  getAllTablesData: () => void
}

const TableBill = ({ open, setOpen, tableData, getAllTablesData }: TableBillPropType) => {
  // States
  //const [userData, setUserData] = useState<EditUserInfoProps['data']>(data)
  const [data, setData] = useState({} as CustomerInvoiceType)
  const [inputData, setInputData] = useState({} as { discount?: number | null; paymentMethod: string })

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const getBillData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    if (open && tableData._id) {
      try {
        const response = await axios.get(`${apiBaseUrl}/games/getBilling/${tableData._id}`, {
          headers: { 'auth-token': token }
        })
        if (response && response.data) {
          setData(response.data)
        }
      } catch (error: any) {
        // if (error?.response?.status === 400) {
        //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        //   return router.replace(redirectUrl)
        // }
        toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
      }
    }
  }

  useEffect(() => {
    getBillData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData._id, open])

  const handleClose = () => {
    setInputData({ discount: null, paymentMethod: '' })
    setOpen(false)
  }

  const handleSubmit = async () => {
    const requestData = { ...inputData, timeDelta: data.timeDelta, totalBillAmt: data.totalBillAmt }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(`${apiBaseUrl}/games/checkoutTable/${tableData._id}`, requestData, {
        headers: { 'auth-token': token }
      })

      if (response && response.data) {
        setInputData({ discount: null, paymentMethod: '' })
        getAllTablesData()
        setOpen(false)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
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
            <BillPreviewCard
              tableData={tableData}
              inputData={inputData}
              setInputData={setInputData}
              data={data}
              setData={setData}
            />
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
