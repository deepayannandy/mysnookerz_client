// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const session = await getServerSession()

  return <>{session ? children : children}</>
}
