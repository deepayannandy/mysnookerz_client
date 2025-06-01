'use client'

import { PlanAccessControl } from '@/const/PlanBasedAccess'
import { PlanAccessType, PlanEnum } from '@/types/adminTypes'

export function getPlanAccessControl(): PlanAccessType {
  const subscription = localStorage.getItem('subscription')
  let planAccessControl = {} as PlanAccessType
  if (subscription) {
    planAccessControl = PlanAccessControl[subscription.toLowerCase() as PlanEnum]
  }

  return planAccessControl
}
