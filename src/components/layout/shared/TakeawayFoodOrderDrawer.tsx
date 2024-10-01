'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Hook Imports
import TakeawayFoodOrder from '@/components/dialogs/takeaway-food-order'

const TakeawayFoodOrderDrawer = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='!text-textPrimary'>
        <i className='ri-restaurant-2-line' />
      </IconButton>
      <TakeawayFoodOrder open={open} setOpen={setOpen} />
    </>
  )
}

export default TakeawayFoodOrderDrawer
