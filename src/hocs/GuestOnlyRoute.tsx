'use client'

// Next Imports
import { redirect } from 'next/navigation'

// Third-party Imports

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const GuestOnlyRoute = ({ children, lang }: ChildrenType & { lang: Locale }) => {
  const token = localStorage.getItem('token')

  if (token) {
    redirect(getLocalizedUrl(themeConfig.homePageUrl, lang))
  }

  return <>{children}</>
}

export default GuestOnlyRoute
