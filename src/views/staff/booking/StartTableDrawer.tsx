// React Imports

// MUI Imports
import { TableDataType } from '@/types/adminTypes'
import { CustomerDataType } from '@/types/staffTypes'
import { Autocomplete, Chip, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useEffect, useState } from 'react'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

// Types Imports

type Props = {
  open: boolean
  handleClose: () => void
  tableData: TableDataType
  getAllTablesData: () => void
}

type FormValidateType = {
  customers: { fullName: string; customerId?: string }[]
  gameType: string
}

const StartTableDrawer = (props: Props) => {
  // Props
  const { open, handleClose, tableData, getAllTablesData } = props

  const [customersList, setCustomersList] = useState([] as { fullName: string; customerId: string }[])

  const getCustomerData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/customer/myCustomers`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        const data = response.data.map((customer: CustomerDataType) => {
          return {
            customerId: customer._id,
            fullName: `${customer.fullName}(${customer.contact})`
          }
        })
        setCustomersList(data)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getCustomerData()
  }, [])

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      gameType: '',
      customers: [{ fullName: 'CASH' }]
    }
  })

  const onSubmit = async (data: FormValidateType) => {
    const players = data.customers.map(customer => {
      if (typeof customer === 'string') {
        return { fullName: customer }
      }
      return customer
    })
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/startGame/${tableData._id}`,
        { gameType: data.gameType, players },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        handleReset()
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data ?? error?.message, { hideProgressBar: false })
    }
  }

  const handleReset = () => {
    resetForm()
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{tableData.tableName}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
          <FormControl fullWidth>
            <InputLabel id='gameType' error={Boolean(errors.gameType)}>
              Select Game Type
            </InputLabel>
            <Controller
              name='gameType'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label='Select Game Type' {...field} error={Boolean(errors.gameType)}>
                  {tableData.gameTypes?.map(type => <MenuItem value={type}>{type}</MenuItem>)}
                </Select>
              )}
            />
            {errors.gameType && <FormHelperText error>This field is required.</FormHelperText>}
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name='customers'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  options={customersList}
                  getOptionLabel={option => (option as { fullName: string; customerId: string }).fullName}
                  // defaultValue={['CASH']}
                  freeSolo
                  onChange={(_, value) => field.onChange(value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        size='small'
                        variant='outlined'
                        label={option.fullName ?? option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={params => (
                    <TextField {...params} variant='outlined' label='Customers' placeholder='Customers' />
                  )}
                />
              )}
            />
            {errors.customers && <FormHelperText error>This field is required.</FormHelperText>}
          </FormControl>
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default StartTableDrawer
