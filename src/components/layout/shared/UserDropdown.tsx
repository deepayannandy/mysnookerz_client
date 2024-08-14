'use client'

// React Imports
import type { MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

// Next Imports
import { useParams, usePathname, useRouter } from 'next/navigation'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Third-party Imports
import axios from 'axios'
import { toast } from 'react-toastify'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

type UserDetailsType = {
  fullName: string
  profileImage: string
  email: string
}

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [userDetails, setUserDetails] = useState({} as UserDetailsType)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const { lang: locale } = useParams()
  const pathname = usePathname()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      localStorage.removeItem('token')
      const redirectURL = '/login'

      router.replace(getLocalizedUrl(redirectURL, locale as Locale))
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const getUserDetails = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/user/whoAmI`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        if (response.data.storeId) {
          localStorage.setItem('storeId', response.data.storeId)
        }
        setUserDetails(response.data)
      }
    } catch (error: any) {
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
      localStorage.removeItem('token')
      localStorage.removeItem('storeId')
      const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      return router.replace(redirectUrl)
    }
  }

  useEffect(() => {
    getUserDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt={userDetails.fullName || ''}
          src={userDetails.profileImage || ''}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                    <Avatar alt={userDetails.fullName || ''} src={userDetails.profileImage || ''} />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {userDetails.fullName || ''}
                      </Typography>
                      <Typography variant='caption'>{userDetails.email || ''}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  {/* <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/pages/user-profile')}>
                    <i className='ri-user-3-line' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem> */}
                  {/* <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className='ri-settings-4-line' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className='ri-money-dollar-circle-line' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className='ri-question-line' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem> */}
                  <div className='flex items-center plb-2 pli-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
