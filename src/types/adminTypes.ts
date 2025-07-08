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
  tableType: string
  pauseTime: string
  pauseMin: number
  gameData?: {
    startTime: string
    endTime: string
    gameType: string
    countdownMin: number
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
  countdownRules: Partial<{
    uptoMin: number | null
    countdownDayCharge: number | null
    countdownNightCharge: number | null
  }>[]
  frameRules: Partial<{
    frameDayCharge: number | null
    frameNightCharge: number | null
  }>
  fixedBillingRules: Partial<{
    dayAmt: number | null
    nightAmt: number | null
  }>
  isBreak: boolean
  isBreakHold: boolean
  deviceId: string
  nodeID: string
  isOccupied?: boolean
  isBooked?: boolean
  isHold?: boolean
  productList?: {
    customerDetails: { fullName: string; customerId: string }
    orders: { productId: string; productName: string; productSalePrice: number; qnt: number; _id: string }[]
    orderTotal: number
    _id: string
  }[]
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
    happyHrsStartTime: string
    happyHrsEndTime: string
    happyHrsDiscount: number
    requiredCustomerCount: number
    cancelMins: number
    isCancel: boolean
    isPauseResume: boolean
    isRoundOff: boolean
    isPrintEnable: boolean
    isPrepaidMode: boolean
    isSwitchTable: boolean
    isMultipleBilling: boolean
    isSelfStart: boolean
    isBreak: boolean
    isHoldEnable: boolean
  }
  SubscriptionData?: SubscriptionPlanType
}

export type SubscriptionPlanType = {
  _id: string
  subscriptionName: string
  subscriptionAmount: number
  subscriptionValidity: number
  subscriptionGlobalPrice: number
  subscriptionId: string
  storeId: string
  startDate: string
  endDate: string
  isActive: boolean
  isYearly: boolean
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
  isManualEnable: boolean
  isAutoEnable: boolean
}

export type ProductDataType = {
  _id: string
  productName: string
  productImage: string
  description: string
  category: CategoryListType
  stock: string
  sku: string
  storeId: string
  basePrice: string
  salePrice: string
  tax: number
  quantity: number
  isOutOfStock: boolean
}

export type NewProductDataType = {
  productName: string
  description: string
  category: CategoryListType | string
  barcode?: string
  sku: string
  basePrice: string | number
  salePrice: string | number
  tax: string | number
  quantity: number | string
  isOutOfStock?: boolean
  isQntRequired?: boolean
  isStockRequired?: boolean
}

export type TransactionReportDataType = {
  netAmount: number
  discount: number
  dues: number
  cash: number
  card: number
  upi: number
  gems: number
  allTransaction: TransactionReportTableDataType[]
}

export type TransactionReportTableDataType = {
  transactionId: string
  date: string
  description: string
  netPay: number
  discount: number
  due: number
  paid: number
  paymentMethod?: string
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

export type CafeReportDataType = {
  transactionId: string
  date: string
  description: string
  discount: number
  netPay: number
  due: number
  paid: number
  paymentMethod?: string
  orderItems: {
    productId: string
    productName: string
    productSalePrice: number
    qnt: number
  }[]
}

export type CreditReportDataType = {
  cafeDue: number
  tableDue: number
  totaldue: number
  lineItems: CreditReportTableDataType[]
}

export type CreditReportTableDataType = {
  transactionId: string
  date: string
  description: string
  netPay: number
  credit: number
  received: number
  paymentMethod?: string
}

export type ExpenseDataType = {
  _id: string
  userId: string
  storeId: string
  userName: string
  date: string
  category: CategoryListType
  invoiceNumber: string
  vendorName: string
  name: string
  amount: number
  quantity: number
  invoiceAmount: number
  note: string
  paid: number
  status: string
}

export type CategoryListType = { name: string; categoryId: string }

export const TableTypes = ['Snooker', 'Pool', 'PlayStation', 'Table Tennis', 'Carrom', 'Chess']

export enum BillingTypeEnum {
  ONE = 'ONE',
  TWO = 'TWO',
  ALL = 'ALL'
}

export type TournamentAccess = 'paid' | 'limitedOrPaid'
export type SmsAccess = 'paid'
export type WhatsappAccess = 'paid' | 'limited'

export type PlanAccessType = {
  billingType: BillingTypeEnum
  switchTable: boolean
  restartTable: boolean
  holdCheckout: boolean
  discount: boolean
  happyHours: boolean
  defaultCustomer: boolean
  cancelGame: boolean
  pauseResume: boolean
  roundOff: boolean
  billPrint: boolean
  selfStart: boolean
  dayNightBilling: boolean
  customerListing: boolean
  customerProfile: boolean
  gameHistory: boolean
  cafeHistory: boolean
  cafeManagement: boolean
  cafeOrders: boolean
  advanceBooking: boolean
  shiftManagement: boolean
  blacklistedCustomer: boolean
  dashboardCardsTodayRevenueTransactionsCredit: boolean
  dashboardCardsDiscountReceivedAmountExpenseProfit: boolean
  reportTransaction: boolean
  reportCollection: boolean
  reportTableCustomerDuesRevenueCafe: boolean
  referral: boolean
  notifications: boolean
  staffManagement: boolean
  staffAttendanceSalary: boolean
  expense: boolean
  analytics: boolean
  membership: boolean
  clubExpenseBar: boolean
  tableServicesNotification: boolean
  tournaments: TournamentAccess
  multiClubOperations: boolean
  sms: SmsAccess
  whatsapp: WhatsappAccess
  terminalManagement: boolean
  advancedBilling: boolean
  advancedAnalytics: boolean
}

export type PlanAccessControlType = {
  [PlanEnum.STARTER]: PlanAccessType
  [PlanEnum.PROFESSIONAL]: PlanAccessType
  [PlanEnum.ULTIMATE]: PlanAccessType
  [PlanEnum.ENTERPRISE]: PlanAccessType
}

export enum PlanEnum {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ULTIMATE = 'ultimate',
  ENTERPRISE = 'enterprise'
}
