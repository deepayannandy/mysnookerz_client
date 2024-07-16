export type Customer = {
  transactionId: string
  registrationDate: string
  customerName: string
  email: string
  city: string
  country: string
  subscription: string
  coins: string
  plan: string
  expiringOn: string
  status: string
  actions?: string
  id: number
  customer: string
  customerId: string
  countryCode: string
  countryFlag?: string
  order: number
  totalSpent: number
  avatar: string
  contact?: string
}

export type Client = {
  transactionId: string
  registrationDate: string
  storeId: string
  storeName: string
  city: string
  country: string
  subscription: string
  plan: string
  expiringOn: string
  status: string
  actions?: string
  id: number
  customer: string
  customerId: string
  email: string
  countryCode: string
  countryFlag?: string
  order: number
  totalSpent: number
  avatar: string
  contact?: string
}

export type Device = {
  id: number
  serialNumber: string
  activationDate: string
  macId: string
  ipAddress: string
  storeId: string
  warrantyDate: string
  status: string
}

export type ReferralsType = {
  id: number
  user: string
  email: string
  avatar: string
  referredId: number
  status: string
  value: string
  earning: string
}

export type ReviewType = {
  id: number
  product: string
  companyName: string
  productImage: string
  reviewer: string
  email: string
  avatar: string
  date: string
  status: string
  review: number
  head: string
  para: string
}

export type ProductType = {
  id: number
  productName: string
  category: string
  stock: boolean
  sku: number
  price: string
  qty: number
  status: string
  image: string
  productBrand: string
}

export type OrderType = {
  id: number
  order: string
  customer: string
  email: string
  avatar: string
  payment: number
  status: string
  spent: number
  method: string
  date: string
  time: string
  methodNumber: number
}

export type ECommerceType = {
  products: ProductType[]
  orderData: OrderType[]
  clientData: Client[]
  customerData: Customer[]
  reviews: ReviewType[]
  referrals: ReferralsType[]
}
