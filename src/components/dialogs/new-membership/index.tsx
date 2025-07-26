'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type NewMembershipDataType = {
  membershipName: string
  type: string
  balanceMinute: number | string
  validity: number | string
  amount: number | string
  dailyLimit: number | string
}

type NewMembershipProps = {
  open: boolean
  setOpen: (open: boolean) => void
  getMembershipData: () => void
}

const NewMembership = ({ open, setOpen, getMembershipData }: NewMembershipProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<NewMembershipDataType>({
    defaultValues: {
      membershipName: '',
      type: '',
      balanceMinute: '',
      validity: '',
      amount: '',
      dailyLimit: ''
    }
  })

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: NewMembershipDataType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(`${apiBaseUrl}/membership`, data, { headers: { 'auth-token': token } })

      if (response && response.data) {
        getMembershipData()
        resetForm()
        setOpen(false)
        toast.success('Membership created successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>New Membership</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            <Controller
              name='membershipName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Membership Name'
                  value={value}
                  onChange={onChange}
                  {...(errors.membershipName && { error: true, helperText: errors.membershipName.message })}
                />
              )}
            />

            <Controller
              name='type'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Type'
                  value={value}
                  onChange={onChange}
                  {...(errors.type && { error: true, helperText: errors.type.message })}
                />
              )}
            />

            <Controller
              name='balanceMinute'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Balance Minute'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={event => {
                    onChange(event)
                  }}
                  {...(errors.balanceMinute && { error: true, helperText: errors.balanceMinute.message })}
                />
              )}
            />

            <Controller
              name='validity'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Validity'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={event => {
                    onChange(event)
                  }}
                  {...(errors.validity && { error: true, helperText: errors.validity.message })}
                />
              )}
            />

            <Controller
              name='amount'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Amount'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={event => {
                    onChange(event)
                  }}
                  {...(errors.amount && { error: true, helperText: errors.amount.message })}
                />
              )}
            />

            <Controller
              name='dailyLimit'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Daily Limit'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={event => {
                    onChange(event)
                  }}
                  {...(errors.dailyLimit && { error: true, helperText: errors.dailyLimit.message })}
                />
              )}
            />

            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default NewMembership
