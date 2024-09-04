'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports

// MUI Imports
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Fade from '@mui/material/Fade'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'

// Type Imports

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import Button from '@mui/material/Button'

type MenuDataType = {
  name: string
}

// Vars
const menuData: MenuDataType[] = [
  {
    name: 'Set Credit Limit'
  },
  {
    name: 'Add Old Credit'
  },
  {
    name: 'Delete Customer'
  }
]

const MenuDropdown = ({
  setCreditLimitDialogOpen,
  setOldCreditDialogOpen,
  setDeleteConfirmationDialogOpen
}: {
  setCreditLimitDialogOpen: (value: boolean) => void
  setOldCreditDialogOpen: (value: boolean) => void
  setDeleteConfirmationDialogOpen: (value: boolean) => void
}) => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings } = useSettings()

  const handleClose = () => {
    setOpen(false)
  }

  const handleMenuItemClick = (name: string) => {
    if (name === 'Set Credit Limit') {
      setCreditLimitDialogOpen(true)
    } else if (name === 'Add Old Credit') {
      setOldCreditDialogOpen(true)
    } else if (name === 'Delete Customer') {
      setDeleteConfirmationDialogOpen(true)
    }
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  return (
    <>
      {/* <IconButton ref={anchorRef} onClick={handleToggle} className='!text-textPrimary'>
        <i className='ri-translate-2' />
      </IconButton> */}
      <Button variant='outlined' color='error' ref={anchorRef} onClick={handleToggle}>
        Menu
      </Button>
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
                  {menuData.map(data => (
                    <MenuItem key={data.name} onClick={() => handleMenuItemClick(data.name)}>
                      {data.name}
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

export default MenuDropdown
