'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { SecondaryStoreDataType, UserDetailsType } from '@/types/userTypes'
import axios from 'axios'
import { toast } from 'react-toastify'

const SwitchStore = ({ userDetails, getUserDetails }: { userDetails: UserDetailsType; getUserDetails: () => void }) => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings } = useSettings()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const switchToSecondaryStore = async (secondaryStoreDetails: SecondaryStoreDataType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const clientId = localStorage.getItem('clientId')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/user/changeStore/${clientId}`,
        { switchStore: secondaryStoreDetails.storeId },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        if (response.data.newStoreId) {
          localStorage.setItem('storeId', response.data.newStoreId)
        }
        getUserDetails()
        window.location.reload()
        handleClose()
        toast.success('Store changed successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message || error?.message, { hideProgressBar: false })
    }
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='!text-textPrimary'>
        <i className='ri-group-2-fill' />
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  {userDetails.secondaryStoreId?.map(store => (
                    <MenuItem key={store._id} onClick={() => switchToSecondaryStore(store)} value={store.storeId}>
                      {store.storeName}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default SwitchStore
