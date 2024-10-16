'use client'

import { CollectionReportDataType } from '@/types/adminTypes'
import CollectionReportTable from '@/views/admin/reports/CollectionReportTable'
import { Grid } from '@mui/material'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CollectionReportPage = () => {
  const [reportData, setReportData] = useState({} as CollectionReportDataType[])

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getReportData = async (dates?: { startDate: string; endDate: string }) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')

    const queryParams = dates?.startDate && dates.endDate ? `startDate=${dates.startDate}&endDate=${dates.endDate}` : ''

    try {
      const response = await axios.get(`${apiBaseUrl}/reports/collectionReport/${storeId}/?${queryParams}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        setReportData(response.data)
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
    getReportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const reportCardData: { title: string; subtitle: string; icon: string }[] = [
  //   {
  //     title: `₹${reportData.netAmount ?? 0}`,
  //     subtitle: 'Net Amount',
  //     icon: 'ri-user-3-line'
  //   },
  //   {
  //     title: `₹${reportData.discount ?? 0}`,
  //     subtitle: 'Discount',
  //     icon: 'ri-pages-line'
  //   },
  //   {
  //     title: `₹${reportData.dues ?? 0}`,
  //     subtitle: 'Dues',
  //     icon: 'ri-wallet-line'
  //   },
  //   {
  //     title: `₹${reportData.cash ?? 0}`,
  //     subtitle: 'Cash',
  //     icon: 'ri-money-dollar-circle-line'
  //   },
  //   {
  //     title: `₹${reportData.card ?? 0}`,
  //     subtitle: 'Card',
  //     icon: 'ri-money-dollar-circle-line'
  //   },
  //   {
  //     title: `₹${reportData.upi ?? 0}`,
  //     subtitle: 'UPI',
  //     icon: 'ri-money-dollar-circle-line'
  //   },
  //   {
  //     title: `₹${reportData.gems ?? 0}`,
  //     subtitle: 'Gems',
  //     icon: 'ri-money-dollar-circle-line'
  //   }
  // ]

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <ReportCard data={reportCardData ?? []} />
      </Grid> */}
      <Grid item xs={12}>
        <CollectionReportTable data={reportData ?? []} />
      </Grid>
    </Grid>
  )
}

export default CollectionReportPage
