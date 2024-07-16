'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

type RenewSubscriptionData = {
  plan?: string
  amount?: string
  discount?: string
  netAmount?: string
  paymentMethod?: string
  subscription?: string
  clientName?: string
  storeName?: string
  email?: string
  address?: string
  pincode?: string
  city?: string
  state?: string
  firstName?: string
  lastName?: string
  userName?: string
  billingEmail?: string
  status?: string
  taxId?: string
  contact?: string
  language?: string[]
  country?: string
  useAsBillingAddress?: boolean
}

type RenewSubscriptionProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: RenewSubscriptionData
}

// Vars
const initialData: RenewSubscriptionProps['data'] = {
  firstName: 'Oliver',
  lastName: 'Queen',
  userName: 'oliverQueen',
  billingEmail: 'oliverQueen@gmail.com',
  status: 'status',
  taxId: 'Tax-8894',
  contact: '+ 1 609 933 4422',
  language: ['english'],
  country: 'US',
  useAsBillingAddress: true
}

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

// const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

// const countries = ['Select Country', 'India', 'France', 'Russia', 'China', 'UK', 'US']

const subscriptions = ['Entry', 'Lite', 'Premium']

const plans = ['Monthly', 'Annual']

const storeNames = ['Delight', 'Corner']

const paymentMethods = ['UPI', 'CASH', 'CARD']

const RenewSubscription = ({ open, setOpen, data }: RenewSubscriptionProps) => {
  // States
  const [subscriptionData, setSubscriptionData] = useState<RenewSubscriptionProps['data']>(data || initialData)

  const handleClose = () => {
    setOpen(false)
    setSubscriptionData(data || initialData)
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Renew Subscription</div>
        {/* <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography> */}
      </DialogTitle>
      <form onSubmit={e => e.preventDefault()}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Store Name</InputLabel>
                <Select
                  label='Store Name'
                  value={subscriptionData?.storeName?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setSubscriptionData({ ...subscriptionData, storeName: e.target.value as string })}
                >
                  {storeNames.map((storeName, index) => (
                    <MenuItem key={index} value={storeName.toLowerCase().replace(/\s+/g, '-')}>
                      {storeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription</InputLabel>
                <Select
                  label='Subscription'
                  value={subscriptionData?.subscription?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setSubscriptionData({ ...subscriptionData, subscription: e.target.value as string })}
                >
                  {subscriptions.map((subscription, index) => (
                    <MenuItem key={index} value={subscription.toLowerCase().replace(/\s+/g, '-')}>
                      {subscription}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plan</InputLabel>
                <Select
                  label='Plan'
                  value={subscriptionData?.plan?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setSubscriptionData({ ...subscriptionData, plan: e.target.value as string })}
                >
                  {plans.map((plan, index) => (
                    <MenuItem key={index} value={plan.toLowerCase().replace(/\s+/g, '-')}>
                      {plan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Amount'
                placeholder='Amount'
                value={subscriptionData?.amount}
                onChange={e => setSubscriptionData({ ...subscriptionData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Discount'
                placeholder='Discount'
                value={subscriptionData?.discount}
                onChange={e => setSubscriptionData({ ...subscriptionData, discount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Net Amount'
                placeholder='Net Amount'
                value={subscriptionData?.netAmount}
                onChange={e => setSubscriptionData({ ...subscriptionData, netAmount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  label='Payment Method'
                  value={subscriptionData?.paymentMethod?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setSubscriptionData({ ...subscriptionData, paymentMethod: e.target.value as string })}
                >
                  {paymentMethods.map((paymentMethod, index) => (
                    <MenuItem key={index} value={paymentMethod.toLowerCase().replace(/\s+/g, '-')}>
                      {paymentMethod}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label='Status'
                  value={subscriptionData?.status}
                  onChange={e => setSubscriptionData({ ...subscriptionData, status: e.target.value as string })}
                >
                  {status.map((status, index) => (
                    <MenuItem key={index} value={status.toLowerCase().replace(/\s+/g, '-')}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Tax ID'
                placeholder='Tax-7490'
                value={subscriptionData?.taxId}
                onChange={e => setSubscriptionData({ ...subscriptionData, taxId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Contact'
                placeholder='+ 123 456 7890'
                value={subscriptionData?.contact}
                onChange={e => setSubscriptionData({ ...subscriptionData, contact: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  label='Language'
                  multiple
                  value={subscriptionData?.language?.map(lang => lang.toLowerCase().replace(/\s+/g, '-')) || []}
                  onChange={e => setSubscriptionData({ ...subscriptionData, language: e.target.value as string[] })}
                  renderValue={selected => (
                    <div className='flex items-center gap-2 flex-wrap'>
                      {(selected as string[]).map(value => (
                        <Chip key={value} label={value} className='capitalize' size='small' />
                      ))}
                    </div>
                  )}
                >
                  {languages.map((language, index) => (
                    <MenuItem key={index} value={language.toLowerCase().replace(/\s+/g, '-')}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={handleClose} type='submit'>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RenewSubscription
