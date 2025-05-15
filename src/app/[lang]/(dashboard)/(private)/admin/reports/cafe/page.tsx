'use client'

import { CafeReportDataType } from '@/types/adminTypes'
import CafeReportTable from '@/views/admin/reports/CafeReportTable'
import { Grid } from '@mui/material'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CafeReportPage = () => {
  const [reportData, setReportData] = useState({} as CafeReportDataType[])

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
      const response = await axios.get(`${apiBaseUrl}/reports/cafeReport/${storeId}/?${queryParams}`, {
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CafeReportTable data={reportData ?? []} getReportData={getReportData} />
      </Grid>
    </Grid>
  )
}

export default CafeReportPage
