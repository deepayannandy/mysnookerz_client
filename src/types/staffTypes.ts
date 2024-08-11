import { CustomAvatarProps } from '@/@core/components/mui/Avatar'
import { OptionsMenuType } from '@/@core/components/option-menu/types'
import { ThemeColor } from '@/@core/types'

export type HistoryDataType = {
  _id: string
  date: string
  transactionId: string
  customerName: string
  description: string
  startTime: string
  endTime: string
  time: string
  booking: number
  meal: string
  discount: number
  netPay: number
  status: string
}

export type CustomerDataType = {
  _id: string
  fullName: string
  contact: number
  rewards: string
  credit: number
}

export type VerticalCardStatsPropsType = {
  title: string
  stats: string
  avatarIcon: string
  subtitle: string
  avatarColor?: ThemeColor
  trendNumber: string
  trend?: 'positive' | 'negative'
  avatarSkin?: CustomAvatarProps['skin']
  avatarSize?: number
  moreOptions?: OptionsMenuType
}

export type CustomerInvoiceType = {
  timeDelta: number
  selectedTable: {
    gameData: {
      startTime: string
      endTime: string
      players: {
        fullName: string
        customerId: string
      }[]
    }
  }
  billBreakup: { title: string; time: number; amount: number }[]
  totalBillAmt: number
  tax?: number
  total: number
  discount?: number | null
  return?: number | null
  // storeName: string
  // city: string
  // state: string
  // country: string
  paymentMethod?: string
}
