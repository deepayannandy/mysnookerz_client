'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CustomIconButton from '@/@core/components/mui/IconButton'
import { ProductDataType } from '@/types/adminTypes'
import { CustomerDataType, CustomerListType } from '@/types/staffTypes'
import { getInitials } from '@/utils/getInitials'
import { Autocomplete, Avatar, Chip, Divider, Drawer, MenuItem, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type TakeawayFoodOrderPropType = {
  open: boolean
  setOpen: (open: boolean) => void
}

type MealCartType = {
  customers: CustomerListType[]
  order: {
    product: ProductDataType
    quantity: number | string
  }[]
}

const paymentMethods = ['CASH', 'UPI', 'CARD']

const TakeawayFoodOrder = ({ open, setOpen }: TakeawayFoodOrderPropType) => {
  // States
  const [productList, setProductList] = useState([] as ProductDataType[])
  const [customersList, setCustomersList] = useState([] as CustomerListType[])
  const [inputData, setInputData] = useState({
    discount: '',
    paymentMethod: paymentMethods[0],
    cashIn: ''
  } as {
    discount?: number | string
    paymentMethod: string
    cashIn?: number | string
  })

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<MealCartType>({
    //resolver: yupResolver(schema),
    defaultValues: {
      customers: [],
      order: [
        {
          product: productList[0],
          quantity: ''
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'order' // unique name for your Field Array
  })

  let subTotal = 0
  watch('order').map(input => {
    if (input.product?.salePrice && input.quantity) {
      subTotal = subTotal + Number(input.product.salePrice) * Number(input.quantity)
    }
  })
  const tax = ((subTotal * 10) / 100).toFixed(2)
  const total = (Number(subTotal) + Number(tax) - Number(inputData.discount ?? 0)).toFixed(2)
  const cashOut = (Number(inputData.cashIn ?? 0) - Number(total ?? 0)).toFixed(2)

  const handleClose = () => {
    resetForm()
    setInputData({
      discount: '',
      paymentMethod: paymentMethods[0],
      cashIn: ''
    })
    setOpen(false)
  }

  const getAllProductsData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/products`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setProductList(response.data)
        resetForm({
          order: [
            {
              product: response.data[0],
              quantity: ''
            }
          ]
        })
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const getAllCustomersData = async () => {
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
      // if (error?.response?.status === 401) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getAllProductsData()
    getAllCustomersData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: MealCartType) => {
    const orderItems = data.order.map(ord => {
      return {
        productId: ord.product._id,
        productName: ord.product.productName,
        productSalePrice: ord.product.salePrice,
        qnt: ord.quantity
      }
    })

    const customers = data.customers.map(customer => {
      if (typeof customer === 'string') {
        return { fullName: customer }
      }
      return customer
    })

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/order`,
        {
          customers,
          orderItems,
          total: (Number(subTotal ?? 0) + Number(tax ?? 0)).toFixed(2),
          discount: inputData.discount,
          netPay: total,
          credit: inputData.cashIn,
          paymentMethod: inputData.paymentMethod
        },
        {
          headers: { 'auth-token': token }
        }
      )
      if (response && response.data) {
        handleClose()
        toast.success('Order Placed!', { icon: <>👏</> })
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 340, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Order Food</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            <Controller
              name='customers'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={customersList}
                  getOptionLabel={option => ((option as CustomerListType).fullName ?? option)?.split('(').join(' (')}
                  multiple
                  freeSolo
                  value={value}
                  onChange={(_, value) => onChange(value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index })
                      return (
                        <Chip
                          size='small'
                          variant='outlined'
                          avatar={option.fullName ? <Avatar>{getInitials(option.fullName)}</Avatar> : <></>}
                          label={option.fullName ?? option}
                          {...tagProps}
                          key={key}
                        />
                      )
                    })
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Customers'
                      {...(errors.customers && {
                        error: true,
                        helperText: errors.customers.message || 'This field is required'
                      })}
                    />
                  )}
                />
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id} className='flex flex-col sm:flex-row items-start mbe-4 gap-3'>
                <Controller
                  name={`order.${index}.product`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      fullWidth
                      options={productList}
                      getOptionLabel={option => `${option.productName} (₹${option.salePrice})`}
                      value={value}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      onChange={(_, value) => onChange(value)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Product'
                          {...(errors.order?.[index]?.product && {
                            error: true,
                            helperText: errors.order?.[index]?.product?.message || 'This field is required'
                          })}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name={`order.${index}.quantity`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Quantity'
                      inputProps={{ type: 'number', min: 0 }}
                      value={value}
                      onChange={onChange}
                      {...(errors.order?.[index]?.quantity && {
                        error: true,
                        helperText: errors.order?.[index]?.quantity?.message || 'This field is required'
                      })}
                    />
                  )}
                />

                {fields.length > 1 ? (
                  <CustomIconButton onClick={() => remove(index)} className='min-is-fit'>
                    <i className='ri-close-line' />
                  </CustomIconButton>
                ) : (
                  <></>
                )}
              </div>
            ))}
            <Button
              className='min-is-fit'
              size='small'
              variant='contained'
              onClick={() => append({ product: productList[0], quantity: '' })}
              startIcon={<i className='ri-add-line' />}
            >
              Add Item
            </Button>

            <div className='w-full grid grid-cols-3 gap-2 border p-4 mt-2 rounded-lg'>
              <p className='col-span-2'>Sub Total</p>
              <p>{`₹${subTotal.toFixed(2)}`}</p>

              <p className='col-span-2'>Tax 10%(VAT included)</p>
              <p>{`₹${tax}`}</p>

              {inputData.discount ? (
                <>
                  <p className='col-span-2'>Discount</p>
                  <p>{`₹${inputData.discount}`}</p>
                </>
              ) : (
                <></>
              )}

              <Divider className='border-dashed col-span-3' />
              <p className='col-span-2'>Total</p>
              <p>{`₹${total}`}</p>
            </div>

            <div className='w-full grid grid-cols-2 gap-2 mt-2 rounded-lg'>
              <TextField
                //placeholder='₹_._'
                inputProps={{ type: 'number', min: 0, step: 'any' }}
                label='Discount'
                value={inputData.discount}
                onChange={event =>
                  setInputData({
                    ...inputData,
                    discount: event.target.value
                  })
                }
              />

              <TextField
                label='Payment Method'
                select
                value={inputData.paymentMethod}
                onChange={e => {
                  setInputData({ ...inputData, paymentMethod: e.target.value })
                }}
              >
                {paymentMethods.map((paymentMethod, index) => (
                  <MenuItem key={index} value={paymentMethod}>
                    {paymentMethod}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label='Cash In'
                //placeholder='₹_._'
                inputProps={{ type: 'number', min: 0, step: 'any' }}
                value={inputData.cashIn}
                onChange={event =>
                  setInputData({
                    ...inputData,
                    cashIn: event.target.value
                  })
                }
              />
              <TextField
                //className='w-full bg-[#E73434] rounded-lg'
                label='Cash Out'
                value={`₹${cashOut}`}
                InputProps={
                  {
                    //startAdornment: <p className='m-1'>Net Pay</p>
                  }
                }
              />
            </div>

            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit'>
                Order
              </Button>
              <Button variant='outlined' color='error' type='reset' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default TakeawayFoodOrder
