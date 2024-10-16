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
  pauseTime: string
  pauseMin: number
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

export type ProductDataType = {
  _id: string
  productName: string
  productImage: string
  description: string
  category: string
  stock: string
  sku: string
  storeId: string
  basePrice: string
  salePrice: string
  quantity: number
  isOutOfStock: boolean
}

export type NewProductDataType = {
  productName: string
  description: string
  category: string
  barcode?: string
  sku: string
  basePrice: string | number
  salePrice: string | number
  quantity: number | string
  isOutOfStock?: boolean
  isQntRequired?: boolean
}

export type TransactionReportDataType = {
  netAmount: number
  discount: number
  dues: number
  cash: number
  card: number
  upi: number
  gems: number
  data: TransactionReportTableDataType[]
}

export type TransactionReportTableDataType = {
  transactionId: string
  date: string
  description: string
  netPay: number
  discount: number
  dues: number
}

export type CollectionReportDataType = {
  transactionId: string
  userName: string
  loginTime: string
  logoutTime: string
  totalCollection: number
  totalReceived: number
  cash: number
  upi: number
  gems: number
  cashDrawerBalance: number
}
