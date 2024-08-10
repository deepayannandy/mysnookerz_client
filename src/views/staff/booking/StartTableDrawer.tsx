// React Imports

// MUI Imports
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
import { useState } from 'react'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'

// Types Imports

type Props = {
  open: boolean
  handleClose: () => void
  tableName: string
  tableData: {
    table: string
    isTableActive: boolean
    startTable: boolean
    billingType: string
  }[]
  setTableData: (
    value: {
      table: string
      isTableActive: boolean
      startTable: boolean
      billingType: string
    }[]
  ) => void
}

type FormValidateType = {
  customers: string[]
  billingType: string
}

type NewGameType = {
  billingType: string
  customers: string[]
}

const billingTypes = ['Minute Billing']
const customerList = ['Deep', 'Nandy', 'Mrinal']

const StartTableDrawer = (props: Props) => {
  // Props
  const { open, handleClose, tableName, tableData, setTableData } = props
  const [data, setData] = useState({} as NewGameType)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      billingType: '',
      customers: ['CASH']
    }
  })

  const onSubmit = (data: FormValidateType) => {
    console.log({ data })
    const newGame: NewGameType = {
      billingType: data.billingType,
      customers: data.customers
    }
    console.log({ newGame })
    const tableDetails = tableData.map(tData => {
      if (tData.table === tableName) {
        tData.startTable = true
      }
      return tData
    })
    setTableData(tableDetails)
    resetForm()
    handleClose()
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
        <Typography variant='h5'>{tableName}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
          <FormControl fullWidth>
            <InputLabel id='billingType' error={Boolean(errors.billingType)}>
              Select Billing Type
            </InputLabel>
            <Controller
              name='billingType'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label='Select Billing Type' {...field} error={Boolean(errors.billingType)}>
                  {billingTypes.map(type => (
                    <MenuItem value={type}>{type}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.billingType && <FormHelperText error>This field is required.</FormHelperText>}
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
                  options={customerList}
                  getOptionLabel={option => option}
                  // defaultValue={['CASH']}
                  freeSolo
                  onChange={(_, value) => field.onChange(value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip size='small' variant='outlined' label={option} {...getTagProps({ index })} />
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

          {/* // <Controller
          //   name='fullName'
          //   control={control}
          //   rules={{ required: true }}
          //   render={({ field }) => (
          //     <TextField
          //       {...field}
          //       fullWidth
          //       label='Full Name'
          //       placeholder='John Doe'
          //       {...(errors.fullName && { error: true, helperText: 'This field is required.' })}
          //     />
          //   )}
          // />
          // <Controller
          //   name='username'
          //   control={control}
          //   rules={{ required: true }}
          //   render={({ field }) => (
          //     <TextField
          //       {...field}
          //       fullWidth
          //       label='Username'
          //       placeholder='johndoe'
          //       {...(errors.username && { error: true, helperText: 'This field is required.' })}
          //     />
          //   )}
          // />
          // <Controller
          //   name='email'
          //   control={control}
          //   rules={{ required: true }}
          //   render={({ field }) => (
          //     <TextField
          //       {...field}
          //       fullWidth
          //       type='email'
          //       label='Email'
          //       placeholder='johndoe@gmail.com'
          //       {...(errors.email && { error: true, helperText: 'This field is required.' })}
          //     />
          //   )}
          // />

          // <FormControl fullWidth>
          //   <InputLabel id='country' error={Boolean(errors.plan)}>
          //     Select Plan
          //   </InputLabel>
          //   <Controller
          //     name='plan'
          //     control={control}
          //     rules={{ required: true }}
          //     render={({ field }) => (
          //       <Select label='Select Plan' {...field} error={Boolean(errors.plan)}>
          //         <MenuItem value='basic'>Basic</MenuItem>
          //         <MenuItem value='company'>Company</MenuItem>
          //         <MenuItem value='enterprise'>Enterprise</MenuItem>
          //         <MenuItem value='team'>Team</MenuItem>
          //       </Select>
          //     )}
          //   />
          //   {errors.plan && <FormHelperText error>This field is required.</FormHelperText>}
          // </FormControl>
          // <FormControl fullWidth>
          //   <InputLabel id='country' error={Boolean(errors.status)}>
          //     Select Status
          //   </InputLabel>
          //   <Controller
          //     name='status'
          //     control={control}
          //     rules={{ required: true }}
          //     render={({ field }) => (
          //       <Select label='Select Status' {...field} error={Boolean(errors.status)}>
          //         <MenuItem value='pending'>Pending</MenuItem>
          //         <MenuItem value='active'>Active</MenuItem>
          //         <MenuItem value='inactive'>Inactive</MenuItem>
          //       </Select>
          //     )}
          //   />
          //   {errors.status && <FormHelperText error>This field is required.</FormHelperText>}
          // </FormControl>
          // <TextField
          //   label='Company'
          //   fullWidth
          //   placeholder='Company PVT LTD'
          //   value={formData.company}
          //   onChange={e => setFormData({ ...formData, company: e.target.value })}
          // />
          // <FormControl fullWidth>
          //   <InputLabel id='country'>Select Country</InputLabel>
          //   <Select
          //     fullWidth
          //     id='country'
          //     value={formData.country}
          //     onChange={e => setFormData({ ...formData, country: e.target.value })}
          //     label='Select Country'
          //     labelId='country'
          //   >
          //     <MenuItem value='India'>India</MenuItem>
          //     <MenuItem value='USA'>USA</MenuItem>
          //     <MenuItem value='Australia'>Australia</MenuItem>
          //     <MenuItem value='Germany'>Germany</MenuItem>
          //   </Select>
          // </FormControl>
          // <TextField
          //   label='Contact'
          //   type='number'
          //   fullWidth
          //   placeholder='(397) 294-5153'
          //   value={formData.contact}
          //   onChange={e => setFormData({ ...formData, contact: e.target.value })}
          // /> */}
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
