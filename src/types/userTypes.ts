export type UserDetailsType = {
  fullName: string
  profileImage: string
  email: string
  userDesignation: string
  mobile: string
  subscription: string
  secondaryStoreId: SecondaryStoreDataType[]
}

export type SecondaryStoreDataType = {
  storeId: string
  storeName: string
  _id: string
}

export type DailyCollectionDataType = {
  tableCollection: number
  cafeCollection: number
  totalCollection: number
  dues: number
  expense: number
  netProfit: number
  cash: number
  card: number
  upi: number
  gems: number
  cashDrawerBalance: number
}
