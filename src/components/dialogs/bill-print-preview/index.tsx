'use client'

import BillPrint, { BillPrintDataType } from '@/components/BillPrint'
import { StoreDataType } from '@/types/adminTypes'
import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
// React Imports

// MUI Imports
import { toast } from 'react-toastify'

type BillPrintPreviewProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data: BillPrintDataType
  getTableData?: () => void
}

const BillPrintPreviewInfo = ({ open, setOpen, data }: BillPrintPreviewProps) => {
  const [storeData, setStoreData] = useState({} as StoreDataType)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const componentRef = useRef<HTMLDivElement>(null)

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef
  })

  const handleClose = () => {
    setOpen(false)
  }

  const getStoreData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        if (!response.data.StoreData?.isPrintEnable) {
          handleClose()
          return
        }
        setStoreData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getStoreData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const printDiv = () => {
  //   const divToPrint = document.getElementById('DivIdToPrint')
  //   const newWin = window.open('', 'Print-Window')
  //   if (newWin && divToPrint) {
  //     newWin.document.open()
  //     newWin.document.write(
  //       `<html><head><title>Print Invoice</title></head><body onload="window.print()">${divToPrint.innerHTML}</body></html>`
  //     )
  //     newWin.document.close()
  //     setTimeout(() => newWin.close(), 10)
  //   }
  // }

  return (
    <>
      <Dialog fullWidth open={open} maxWidth='md' scroll='body'>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <BillPrint data={data} storeData={storeData} />
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' onClick={() => reactToPrintFn()}>
            Print
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <BillPrint
            data={data}
            storeData={storeData}
            style={{
              width: '100vw',
              minWidth: '100vw',
              color: '#000000'
            }}
          />
        </div>
      </div>
    </>
  )
}

export default BillPrintPreviewInfo
