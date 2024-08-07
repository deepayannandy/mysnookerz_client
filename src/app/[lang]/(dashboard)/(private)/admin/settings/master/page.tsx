import TableList from '@/views/admin/master/TableList'

const tableData = [
  {
    name: 'abc',
    billingType: 'Minute Billing',
    day: {
      upToMinute: 15,
      minimumCharge: 50,
      perMinuteCharge: 30
    },
    night: {
      upToMinute: 25,
      minimumCharge: 60,
      perMinuteCharge: 40
    },
    device: 'Android',
    mode: 'Abc',
    isActive: true
  },
  {
    name: 'Xyz',
    billingType: 'Minute Billing',
    day: {
      upToMinute: 16,
      minimumCharge: 70,
      perMinuteCharge: 20
    },
    night: {
      upToMinute: 20,
      minimumCharge: 40,
      perMinuteCharge: 50
    },
    device: 'Android',
    mode: 'Abc',
    isActive: true
  },
  {
    name: 'abKLMc',
    billingType: 'Minute Billing',
    day: {
      upToMinute: 45,
      minimumCharge: 23,
      perMinuteCharge: 61
    },
    night: {
      upToMinute: 34,
      minimumCharge: 35,
      perMinuteCharge: 35
    },
    device: 'IOS',
    mode: 'Xyz',
    isActive: false
  }
]

const MasterDetails = async () => {
  return <TableList tableData={tableData} />
}

export default MasterDetails
