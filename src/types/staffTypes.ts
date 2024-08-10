import { CustomAvatarProps } from '@/@core/components/mui/Avatar'
import { OptionsMenuType } from '@/@core/components/option-menu/types'
import { ThemeColor } from '@/@core/types'

export type HistoryDataType = {
  date: string
  transactionId: string
  customerName: string
  description: string
  start: string
  end: string
  time: string
  table: string
  meals: string
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
