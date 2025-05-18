'use client'

import { StoreDataType } from '@/types/adminTypes'
import { Button, IconButton, Typography } from '@mui/material'
// React Imports

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { useState } from 'react'
import UpgradePlan from '../upgrade-plan'

type PlanUpgradeNotificationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  daysRemaining: number
  storeData: StoreDataType & { clientName: string }
  getStoreData: () => void
}

const PlanUpgradeNotification = ({
  open,
  setOpen,
  daysRemaining,
  storeData,
  getStoreData
}: PlanUpgradeNotificationProps) => {
  const [upgradePlanDialogOpen, setUpgradePlanDialogOpen] = useState(false)
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  // useEffect(() => {
  //   resetForm(customerData)
  // }, [customerData, resetForm])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} maxWidth='sm' scroll='body'>
        <DialogContent className='overflow-visible flex justify-center sm:justify-start flex-col'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <div className='flex sm:flex-row flex-col gap-2 sm:w-full pt-5'>
            <div>
              <img src='/images/icons/expired.png' className='size-full' alt='' />
            </div>

            <div className='pt-10 w-full flex flex-col gap-3'>
              <Typography variant='h4'>
                {daysRemaining > 0
                  ? `YOUR PLAN IS EXPIRING IN ${daysRemaining ?? 0} DAYS!`
                  : 'YOUR PLAN HAS BEEN EXPIRED!'}
              </Typography>
              <Typography variant='subtitle1'>Please renew/upgrade to continue using our services.</Typography>
              <Button
                size='medium'
                variant='contained'
                onClick={() => {
                  setUpgradePlanDialogOpen(true)
                  handleClose()
                }}
              >
                Renew/Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <UpgradePlan
        open={upgradePlanDialogOpen}
        setOpen={setUpgradePlanDialogOpen}
        currentPlan={storeData?.SubscriptionData}
        getUserData={getStoreData}
        userData={storeData}
        renewPlan={false}
      />
    </>
  )
}

export default PlanUpgradeNotification
