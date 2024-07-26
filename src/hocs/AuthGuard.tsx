'use client'

// Third-party Imports
import AuthRedirect from '@/components/AuthRedirect'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const token = window.localStorage.getItem('token')

  return <>{token ? children : <AuthRedirect lang={locale} />}</>
}
