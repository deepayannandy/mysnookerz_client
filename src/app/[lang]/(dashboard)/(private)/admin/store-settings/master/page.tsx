// MUI Imports
import NightTime from '@/views/admin/store-settings/master/NightTime'

// Component Imports

const MasterDetails = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
      <div className='border rounded-lg'>
        <NightTime />
      </div>
      {/* <div className='border rounded-lg'>
        <ProductInformation />
      </div>
      <div className='border rounded-lg'>
        <ProductInformation />
      </div> */}
    </div>
  )
}

export default MasterDetails
