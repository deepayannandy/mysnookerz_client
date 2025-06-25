'use client'

// React Imports
import type { MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

// Next Imports
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'

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
import PlanUpgradeNotification from '@/components/dialogs/plan-upgrade-notification'
import { StoreDataType } from '@/types/adminTypes'
import { DailyCollectionDataType, UserDetailsType } from '@/types/userTypes'
import { getLocalizedUrl } from '@/utils/i18n'
import DailyCollectionData from '@/views/admin/DailyCollectionData'
import { DateTime } from 'luxon'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = ({ userDetails }: { userDetails?: UserDetailsType }) => {
  // States
  const [open, setOpen] = useState(false)
  const [dailyCollectionData, setDailyCollectionData] = useState({} as DailyCollectionDataType)
  const [showDailyCollectionData, setShowDailyCollectionData] = useState(false)
  const [planUpgradeNotificationOpen, setPlanUpgradeNotificationOpen] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [storeData, setStoreData] = useState({} as StoreDataType & { clientName: string })

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const { settings } = useSettings()
  const searchParams = useSearchParams()

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
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const clientId = localStorage.getItem('clientId')
    try {
      const response = await axios.get(`${apiBaseUrl}/admin/signOffReport/${clientId}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        setDailyCollectionData(response.data)
        setShowDailyCollectionData(true)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const getStoreData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    const clientName = localStorage.getItem('clientName')

    try {
      const response = await axios.get(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (
        response &&
        response.data &&
        response.data.SubscriptionData &&
        typeof response.data.SubscriptionData === 'object' &&
        response.data.SubscriptionData.startDate
      ) {
        setStoreData({ ...response.data, clientName })
        const daysPast = Math.round(
          DateTime.now().diff(DateTime.fromISO(response.data.SubscriptionData.startDate), 'days').days
        )

        const daysRemaining = (response.data.SubscriptionData.subscriptionValidity ?? 0) - daysPast

        if (daysRemaining <= 7) {
          setPlanUpgradeNotificationOpen(true)
          setDaysRemaining(daysRemaining)
        }
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      getStoreData()
      router.replace(pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

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
          alt={userDetails?.fullName || ''}
          src={userDetails?.profileImage || ''}
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
                    <Avatar alt={userDetails?.fullName || ''} src={userDetails?.profileImage || ''} />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {userDetails?.fullName || ''}
                      </Typography>
                      <Typography variant='caption'>{userDetails?.email || ''}</Typography>
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

      <DailyCollectionData
        data={dailyCollectionData}
        open={showDailyCollectionData}
        setOpen={setShowDailyCollectionData}
      />
      <PlanUpgradeNotification
        open={planUpgradeNotificationOpen}
        setOpen={setPlanUpgradeNotificationOpen}
        daysRemaining={daysRemaining}
        storeData={storeData}
        getStoreData={getStoreData}
      />
    </>
  )
}

export default UserDropdown
