import { MembershipDataType } from './adminTypes'

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
  email: string
  profileImage: string
  contact: string
  rewards: string
  credit: number
  isBlackListed: boolean
  reasonOfBlackList: string
  dateOfBlackList: string
  storeId: string
  maxCredit: number
}

export type CustomerDetailsDataType = {
  customers: {
    _id: string
    status: string
    fullName: string
    email: string
    profileImage: string
    dob: string
    city: string
    onBoardingDate: string
    contact: string
    rewardPoint: string
    credit: number
    maxCredit: number
    storeId: string
    isBlackListed: boolean
    isDeleted: boolean
  }
  tableCredit: number
  cafeCredit: number
  winner: number
  orders: number
  totalSpend: number
  hoursSpend: number
  gameCount: number
  membership: {
    membershipName: string
    membershipMin: string
  }
  membershipData: MembershipDataType & { balanceMinuteLeft: number; startDay: string; endDay: string }
}

export type CustomerListType = { fullName: string; customerId: string; showBadge?: boolean }

export type DashboardDataType = {
  sales: number
  credit: number
  discount: number
  transactions: {
    cash: number
    card: number
    upi: number
    prime: number
  }
  creditHistoryToday: DueAmountDataType[]
  // title: string
  // stats: string
  // avatarIcon: string
  // subtitle: string
  // avatarColor?: ThemeColor
  // trendNumber: string
  // trend?: 'positive' | 'negative'
  // avatarSkin?: CustomAvatarProps['skin']
  // avatarSize?: number
  // moreOptions?: OptionsMenuType
}

export type DashboardTotalRevenueDataType = {
  totalRevenue: number
  totalDiscounts: number
  totalExpense: number
  totalProfit: number
  lastMonthBalance: number
  timePeriods: string[]
  discounts: {
    timePeriod: string
    value: number
  }[]
  expense: {
    timePeriod: string
    value: number
  }[]
  profit: {
    timePeriod: string
    value: number
  }[]
}

export type CustomerInvoiceType = {
  timeDelta: number
  selectedTable: {
    gameData: {
      startTime: string
      endTime: string
      gameType: string
      players: {
        fullName: string
        customerId: string
      }[]
    }
    breakPlayers: {
      customerId: string
      customerName: string
      billingAmount: number
      gameTime: number
    }[]
    mealAmount: number
  }
  billBreakup: { title: string; time: number; amount: number }[]

  totalBillAmt: string
  mealTotal: number
  netPay: number
  tax?: number
  total: number
  discount?: number | null
  return?: number | null
  paymentMethod?: string
  productList?: {
    customerDetails: { fullName: string; customerId: string }
    orders: { productId: string; productName: string; productSalePrice: number; qnt: number; _id: string }[]
    orderTotal: number
    _id: string
  }[]
  customerBillBreakup: {
    fullName: string
    customerId: string
    amount: number
  }[]
}

// export type BreakBillType = {
//   timeDelta: number
//   selectedTable: {
//     gameData: {
//       startTime: string
//       endTime: string
//       gameType: string
//       players: {
//         fullName: string
//         customerId: string
//       }[]
//     }
//   }
//   billBreakup: { title: string; time: number; amount: number }[]
//   totalBillAmt: number
//   mealTotal: number
//   netPay: number
//   tax?: number
//   total: number
//   discount?: number | null
//   return?: number | null
//   paymentMethod?: string
//   productList?: {
//     customerDetails: { fullName: string; customerId: string }
//     orders: { productId: string; productName: string; productSalePrice: number; qnt: number; _id: string }[]
//     orderTotal: number
//     _id: string
//   }[]
// }

export type DueAmountDataType = {
  _id: string
  transactionId: string
  fullName: string
  date: string
  description: string
  startTime: string
  endTime: string
  discount: number
  netPay: number
  paid: number
  credit: number
  cafeCredit: number
  quantity: number
  totalDue?: number
  action?: string
}

export type OrderFoodType = {
  productId: string
  productName: string
  productSalePrice: string
  qnt: string | number
}

export type FoodOrderHistoryDataType = {
  _id: string
  storeId: string
  date: string
  customers: CustomerListType
  orderItems: OrderFoodType[]
  description: string
  total: number
  discount: number
  netPay: number
  status: string
  transactionId: string
}

export type PaymentHistoryDataType = {
  transactionId: string
  date: string
  customerName: string
  description: string
  quantity: number
  startTime: string
  endTime: string
  netPay: number
  discount: number
  paid: number
  due: number
  paidBy: string
}
