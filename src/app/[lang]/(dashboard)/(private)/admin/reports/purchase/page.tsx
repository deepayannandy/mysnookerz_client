'use client'

import ReportCard from '@/components/cards/ReportCard'
import { PurchaseReportDataType } from '@/types/adminTypes'
import { getPlanAccessControl } from '@/utils/Utils'
import PurchaseReportTable from '@/views/admin/reports/PurchaseReportTable'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const PurchaseReportPage = () => {
  const [reportData, setReportData] = useState({} as PurchaseReportDataType)

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
      const response = await axios.get(`${apiBaseUrl}/reports/poReport/${storeId}/?${queryParams}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        setReportData(response.data)
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
    getReportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reportCardData: { title: string; subtitle: string; icon: string }[] = [
    {
      title: `${reportData.totalPo ?? 0}`,
      subtitle: 'Total Purchase Orders',
      icon: 'ri-user-3-line'
    },
    {
      title: `₹${reportData.totalAmount ?? 0}`,
      subtitle: 'Total Purchase Amount',
      icon: 'ri-pages-line'
    }
  ]

  const planAccessControl = getPlanAccessControl()

  return (
    <>
      {planAccessControl.reportTableCustomerDuesRevenueCafe ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ReportCard data={reportCardData ?? []} />
          </Grid>
          <Grid item xs={12}>
            <PurchaseReportTable data={reportData.lineItems ?? []} getReportData={getReportData} />
          </Grid>
        </Grid>
      ) : (
        <Typography className='text-center'>You are not allowed to access this page.</Typography>
      )}
    </>
  )
}

export default PurchaseReportPage
