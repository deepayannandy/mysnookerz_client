import { InvoiceStatus } from './apps/invoiceTypes'

export type StaffDataType = {
  _id: string
  fullName: string
  mobile: string
  email: string
  onBoardingDate: string
  profileImage: string
  userStatus: string
  userDesignation: string
}

export type InvoiceType = {
  registrationId: string
  name: string
  registrationDate: string
  city: string
  plan: string
  id: string
  total: number
  avatar: string
  service: string
  dueDate: string
  address: string
  company: string
  country: string
  contact: string
  avatarColor?: string
  issuedDate: string
  companyEmail: string
  balance: string | number
  invoiceStatus: InvoiceStatus
  subscription: string
  amount: string
}

export type TableDataType = {
  _id: string
  tableName: string
  gameData?: {
    startTime: string
    endTime: string
    gameType: string
    players: {
      customerId?: string
      fullName: string
    }[]
  }
  gameTypes: string[]
  minuteWiseRules: Partial<{
    dayUptoMin: number | null
    dayMinAmt: number | null
    dayPerMin: number | null
    nightUptoMin: number | null
    nightMinAmt: number | null
    nightPerMin: number | null
  }>
  slotWiseRules: Partial<{
    uptoMin: number | null
    slotCharge: number | null
    nightSlotCharge: number | null
  }>[]
  deviceId: string
  nodeID: string
  isOccupied?: boolean
  isBooked?: boolean
}

export type UserDataType = StoreDataType & {
  clientName: string
}

export type StoreDataType = {
  StoreData: {
    _id: string
    storeName: string
    contact: string
    email: string
    address: string
    onboarding: string
    validTill: string
    profileImage: string
    transactionCounter: number
    nightEndTime: string
    nightStartTime: string
  }
  SubscriptionData?: {
    _id: string
    subscriptionName: string
    subscriptionAmount: number
    subscriptionValidity: number
    startDate: string
    endDate: string
  }
}

export type DeviceDataType = {
  _id?: number
  deviceType: string
  onboarding: string
  deviceId: string
  storeId: string
  nodes?: string[]
  nodeStatus?: number[]
  warrantyExpiryDate: string
  ipAddress?: string
  warrantyAvailingDate?: string[]
  isActive: boolean
}
