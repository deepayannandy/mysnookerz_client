'use client'

// React Imports
import { ReactElement, useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserLeftOverview from '@/views/admin/account-settings/user-left-overview'
import UserRight from '@/views/admin/account-settings/user-right'

// Data Imports
import { UserDataType } from '@/types/adminTypes'
import BillingPlans from '@/views/admin/account-settings/user-right/billing-plans'
import OverViewTab from '@/views/admin/account-settings/user-right/overview'
import SecurityTab from '@/views/admin/account-settings/user-right/security'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

// Vars
const tabContentList = (userData: UserDataType, getUserData: () => void): { [key: string]: ReactElement } => ({
  //@ts-ignore
  overview: <OverViewTab />,
  security: <SecurityTab />,
  // @ts-ignore
  'billing-plans': <BillingPlans data={userData} getUserData={getUserData} />
  // actions: <NotificationsTab />,
  // deviceControl: <ConnectionsTab />
})

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/pages/pricing` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getPricingData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/pricing`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
} */

const AccountSettings = () => {
  // Vars
  const [userData, setUserData] = useState({} as UserDataType)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getUserData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    const clientName = localStorage.getItem('clientName')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setUserData({ ...response.data, clientName })
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
    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserLeftOverview data={userData} getUserData={getUserData} />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRight tabContentList={tabContentList(userData, getUserData)} />
      </Grid>
    </Grid>
  )
}

export default AccountSettings
