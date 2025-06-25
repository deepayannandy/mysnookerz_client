'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import NavSearch from '@components/layout/shared/search'
import UserDropdown from '@components/layout/shared/UserDropdown'
import NavToggle from './NavToggle'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import TakeawayFoodOrderDrawer from '../shared/TakeawayFoodOrderDrawer'
import SwitchStore from '../shared/SwitchStore'
import { PrimaryColorConfig } from '@/configs/primaryColorConfig'
import { UserDetailsType } from '@/types/userTypes'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useSettings } from '@core/hooks/useSettings'

// Primary color config object
const primaryColorConfig: Record<string, PrimaryColorConfig> = {
  Starter: {
    name: 'primary-1',
    light: '#A379FF',
    main: '#008000',
    dark: '#7E4EE6'
  },
  Professional: {
    name: 'primary-2',
    light: '#4EB0B1',
    main: '#8C57FF',
    dark: '#096B6C'
  },
  Ultimate: {
    name: 'primary-3',
    light: '#F0718D',
    main: '#D37F00',
    dark: '#AC2D48'
  },
  Enterprise: {
    name: 'primary-4',
    light: '#FFC25A',
    main: '#FF4500',
    dark: '#BA7D15'
  }
}

const NavbarContent = () => {
  const [userDetails, setUserDetails] = useState({} as UserDetailsType)

  // Hooks
  const router = useRouter()
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const { updateSettings } = useSettings()

  const getUserDetails = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/user/whoAmI`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setUserDetails(response.data)

        if (response.data.subscription && primaryColorConfig[response.data.subscription]) {
          updateSettings({ primaryColor: primaryColorConfig[response.data.subscription].main })
        }

        if (response.data.storeId) {
          localStorage.setItem('storeId', response.data.storeId)
          localStorage.setItem('storeName', response.data.storeName)
          localStorage.setItem('clientId', response.data._id)
          localStorage.setItem('clientName', response.data.fullName)
          localStorage.setItem('subscription', response.data.subscription)
        }
        if (response.data.userDesignation) {
          localStorage.setItem('userDesignation', response.data.userDesignation)
          if (response.data.userDesignation === 'Staff' && !pathname.includes(`/${locale}/staff/`)) {
            const redirectUrl = `/${locale}/staff/booking`
            return router.replace(redirectUrl)
          }
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
      localStorage.removeItem('token')
      localStorage.removeItem('storeId')
      localStorage.removeItem('storeName')
      localStorage.removeItem('clientId')
      localStorage.removeItem('clientName')
      localStorage.removeItem('subscription')

      const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      return router.replace(redirectUrl)
    }
  }

  useEffect(() => {
    getUserDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-[7px]'>
        <NavToggle />
        <NavSearch />
      </div>
      <div className='flex items-center'>
        {userDetails.secondaryStoreId?.length ? (
          <SwitchStore userDetails={userDetails} getUserDetails={getUserDetails} />
        ) : (
          <></>
        )}
        <TakeawayFoodOrderDrawer />
        <LanguageDropdown />
        <ModeDropdown />
        <UserDropdown userDetails={userDetails} />
      </div>
    </div>
  )
}

export default NavbarContent
