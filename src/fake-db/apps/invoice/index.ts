// Type Imports
import { InvoiceType } from '@/types/adminTypes'

// Vars
const now = new Date()
const currentMonth = now.toLocaleString('default', { month: 'short' })

export const db: InvoiceType[] = []
