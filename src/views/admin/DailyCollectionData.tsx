'use client'

import { Locale } from '@/configs/i18n'
// MUI Imports
import { DailyCollectionDataType } from '@/types/userTypes'
import { getLocalizedUrl } from '@/utils/i18n'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const DailyCollectionData = ({
  data,
  open,
  setOpen
}: {
  data: DailyCollectionDataType
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const { lang: locale } = useParams()
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('storeId')
      localStorage.removeItem('storeName')
      localStorage.removeItem('clientId')
      localStorage.removeItem('clientName')
      const redirectURL = '/login'
      router.replace(getLocalizedUrl(redirectURL, locale as Locale))
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Today’s Billing Collection Report</div>
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>
        <div className='grid grid-cols-1 border'>
          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>Table Collection</p>
            <p className='text-center p-2'>{`₹${data.tableCollection || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>Cafe Collection</p>
            <p className='text-center p-2'>{`₹${data.cafeCollection || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>Dues</p>
            <p className='text-center p-2'>{`₹${data.dues || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>Expense</p>
            <p className='text-center p-2'>{`₹${data.expense || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>Total Collection</p>
            <p className='text-center p-2'>{`₹${data.totalCollection || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>Net Profit</p>
            <p className='text-center p-2'>{`₹${data.netProfit || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>Payment Methods</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>CASH</p>
            <p className='text-center p-2'>{`₹${data.cash || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>UPI</p>
            <p className='text-center p-2'>{`₹${data.upi || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 border-b divide-x'>
            <p className='text-center p-2'>GEMS</p>
            <p className='text-center p-2'>{`₹${data.upi || 0}`}</p>
          </div>

          <div className='grid grid-cols-2 gap-2 divide-x'>
            <p className='text-center p-2'>Cash Drawer Balance</p>
            <p className='text-center p-2'>{`₹${data.cashDrawerBalance || 0}`}</p>
          </div>
        </div>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button className='w-full' variant='contained' onClick={handleLogout}>
          Finish Shift
        </Button>
        {/* <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
          Cancel
        </Button> */}
      </DialogActions>
    </Dialog>
  )
}

export default DailyCollectionData
