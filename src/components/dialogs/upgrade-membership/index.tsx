'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

// Style Imports
import { MembershipDataType } from '@/types/adminTypes'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { CustomerDetailsDataType } from '@/types/staffTypes'

type UpgradeMembershipProps = {
  open: boolean
  setOpen: (open: boolean) => void
  getCustomerData: () => void
  customerData: CustomerDetailsDataType
}

const UpgradeMembership = ({ open, setOpen, getCustomerData, customerData }: UpgradeMembershipProps) => {
  // States
  const [membershipList, setMembershipList] = useState([] as (MembershipDataType & { displayName: string })[])
  const [selectedMembershipId, setSelectedMembershipId] = useState('')

  const selectedMembership = membershipList.find(membership => membership._id === selectedMembershipId)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    setSelectedMembershipId('')
  }

  const getMemberships = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`${apiBaseUrl}/membership`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        const list = [] as (MembershipDataType & { displayName: string })[]

        response.data.forEach((data: MembershipDataType) => {
          list.push({
            ...data,
            displayName: `${data.membershipName} - ₹${data.amount}`
          })
        })
        setMembershipList(list)

        setSelectedMembershipId(list[0]?._id)
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
    getMemberships()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const upgradeCustomerMembership = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.post(
        `${apiBaseUrl}/customer/upgradeToMember`,
        { customerId: customerData.customers._id, membershipId: selectedMembershipId },
        { headers: { 'auth-token': token } }
      )
      if (response && response.data) {
        getCustomerData()
        handleClose()
        toast.success('Membership updated successfully')
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Assign Membership
        <Typography component='span' className='flex flex-col text-center'>
          Choose the best Membership
        </Typography>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 sm:pbe-16'>
        <IconButton onClick={() => handleClose()} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line' />
        </IconButton>
        <div className='flex items-center gap-4 flex-col sm:flex-row'>
          <FormControl fullWidth size='small'>
            <InputLabel id='user-view-Memberships-select-label'>Choose Membership</InputLabel>
            <Select
              label='Choose Membership'
              defaultValue='Standard'
              id='user-view-Memberships-select'
              labelId='user-view-Memberships-select-label'
              value={selectedMembershipId}
              onChange={event => setSelectedMembershipId(event.target.value)}
            >
              {membershipList.map(membership => (
                <MenuItem key={membership._id} value={membership._id}>
                  {membership.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant='contained' className='capitalize sm:is-auto is-full' onClick={upgradeCustomerMembership}>
            Assign
          </Button>
        </div>
        <Divider className='mlb-6' />
        {selectedMembershipId ? (
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-between flex-wrap gap-2'>
              <div className='w-full grid grid-cols-2 gap-2 border p-3 rounded-lg'>
                <p>Amount</p>
                <p>{`₹${selectedMembership?.amount || 0}`}</p>
                {/* <Divider className='col-span-2' /> */}

                {/* <p>Tax @ 18%</p>
                <p>{`₹${((selectedMembership?.subscriptionPrice || 0) * 18) / 100}`}</p>

                <p>Net Pay</p>
                <p>{`₹${((selectedMembership?.subscriptionPrice || 0) + ((selectedMembership?.subscriptionPrice || 0) * 18) / 100).toFixed(2)}`}</p> */}
              </div>
              {/* <div className='flex justify-center items-baseline gap-1'>
                  <Typography component='sup' className='self-start' color='primary'>
                    ₹
                  </Typography>
                  <Typography component='span' color='primary' variant='h1'>
                    {currentMembership.subscriptionAmount ?? 0}
                  </Typography>
                  <Typography component='sub' className='self-baseline' variant='body2'>
                    /month
                  </Typography>
                </div> */}
              {/* <Button
                  variant='outlined'
                  className='capitalize'
                  color='error'
                  onClick={() => setOpenConfirmation(true)}
                >
                  Cancel Subscription
                </Button> */}
            </div>
          </div>
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UpgradeMembership
