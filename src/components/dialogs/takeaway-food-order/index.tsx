'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { ProductDataType } from '@/types/adminTypes'
import { CustomerDataType, CustomerListType } from '@/types/staffTypes'
import { Autocomplete, Divider, Drawer, MenuItem, TextField, Typography } from '@mui/material'
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
  customer: CustomerListType | string
  order: {
    product: ProductDataType
    quantity: number | string
  }[]
}

const paymentMethods = ['CASH', 'UPI', 'CARD']

const TakeawayFoodOrder = ({ open, setOpen }: TakeawayFoodOrderPropType) => {
  // States
  const [productList, setProductList] = useState([] as ProductDataType[])
  const [fieldIndex, setFieldIndex] = useState(0)
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
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<MealCartType>({
    //resolver: yupResolver(schema),
    defaultValues: {
      customer: '',
      order: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'order' // unique name for your Field Array
  })

  const handleAddItem = () => {
    if (!watch(`order.${fieldIndex}.product`)) {
      setError(`order.${fieldIndex}.product`, { type: 'required', message: 'This field is required' })
    } else if (!watch(`order.${fieldIndex}.quantity`)) {
      setError(`order.${fieldIndex}.quantity`, { type: 'required', message: 'This field is required' })
    } else {
      clearErrors('order')
      setFieldIndex(fields.length)
      append({ product: productList[0], quantity: 1 })
    }
  }

  const removeItem = (index: number) => {
    remove(index)
    setFieldIndex(fieldIndex - 1)
  }

  const handleProductChange = (value: ProductDataType | null, onChange: (value: ProductDataType | null) => void) => {
    clearErrors(`order.${fieldIndex}.product`)
    onChange(value)
    setValue(`order.${fieldIndex}.quantity`, 1)
  }

  const handleQuantityChange = (value: string | null, onChange: (value: string | null) => void) => {
    clearErrors(`order.${fieldIndex}.quantity`)
    onChange(value)
  }

  let subTotal = 0
  let tax = 0
  fields.slice(0, -1).map(orderItem => {
    if (orderItem.product?.salePrice && orderItem.quantity) {
      const itemPrice = Number(orderItem.product.salePrice) * Number(orderItem.quantity)
      tax = tax + (itemPrice * Number(orderItem.product.tax ?? 0)) / 100
      subTotal = subTotal + itemPrice
    }
  })

  const total = (Number(subTotal) + Number(tax) - Number(inputData.discount ?? 0)).toFixed(2)
  const cashOut = (Number(inputData.cashIn ?? 0) - Number(total ?? 0)).toFixed(2)

  const handleClose = () => {
    setInputData({
      discount: '',
      paymentMethod: paymentMethods[0],
      cashIn: ''
    })
    resetForm()
    setFieldIndex(0)
    setOpen(false)
  }

  const getAllProductsData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/products`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setProductList(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
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
      // if (error?.response?.status === 409) {
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

  useEffect(() => {
    resetForm({
      customer: '',
      order: [
        {
          product: productList[0],
          quantity: 1
        }
      ]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customersList, productList])

  const onSubmit = async (data: MealCartType) => {
    data.order = data.order.slice(0, -1)
    if (!data.order.length) {
      toast.error('Please add items to place order')
      return
    }
    const orderItems = data.order.map(ord => {
      return {
        productId: ord.product._id,
        productName: ord.product.productName,
        productSalePrice: ord.product.salePrice,
        qnt: ord.quantity
      }
    })

    let customer = {}
    if (typeof data.customer === 'string') {
      customer = { fullName: data.customer }
    } else {
      customer = data.customer
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/order`,
        {
          customer,
          orderItems,
          total: (Number(subTotal ?? 0) + Number(tax ?? 0)).toFixed(2),
          discount: inputData.discount,
          netPay: total,
          cashIn: inputData.cashIn,
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
      // if (error?.response?.status === 409) {
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
              name='customer'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
                  options={customersList}
                  getOptionLabel={option => ((option as CustomerListType).fullName ?? option)?.split('(').join(' (')}
                  getOptionKey={option => (option as CustomerListType).customerId}
                  freeSolo
                  value={value}
                  onChange={(_, value) => onChange(value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Customer'
                      {...(errors.customer && {
                        error: true,
                        helperText: errors.customer.message || 'This field is required'
                      })}
                    />
                  )}
                />
              )}
            />

            <div key={fields[fieldIndex]?.id} className='flex flex-col sm:flex-row items-start gap-3'>
              <Controller
                name={`order.${fieldIndex}.product`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    fullWidth
                    disableClearable
                    options={productList}
                    getOptionLabel={option => `${option.productName} (₹${option.salePrice})`}
                    value={value}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={(_, value) => handleProductChange(value, onChange)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Product'
                        {...(errors.order?.[fieldIndex]?.product && {
                          error: true,
                          helperText: errors.order?.[fieldIndex]?.product?.message || 'This field is required'
                        })}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name={`order.${fieldIndex}.quantity`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Quantity'
                    inputProps={{ type: 'number', min: 0 }}
                    value={value ?? ''}
                    onChange={event => handleQuantityChange(event.target.value, onChange)}
                    {...(errors.order?.[fieldIndex]?.quantity && {
                      error: true,
                      helperText: errors.order?.[fieldIndex]?.quantity?.message || 'This field is required'
                    })}
                  />
                )}
              />

              {/* {fields.length > 1 ? (
                  <CustomIconButton onClick={() => remove(index)} className='min-is-fit'>
                    <i className='ri-close-line' />
                  </CustomIconButton>
                ) : (
                  <></>
                )} */}
            </div>

            <div className='flex justify-end'>
              <Button
                className='min-is-fit'
                size='small'
                variant='contained'
                onClick={handleAddItem}
                startIcon={<i className='ri-add-line' />}
              >
                Add Item
              </Button>
            </div>

            {fields.slice(0, -1).length ? (
              <div className='w-full grid grid-cols-1 border mt-2 rounded-lg overflow-x-auto '>
                <div className='w-full text-center font-bold border-b p-1 sm:p-2'>Ordered Items</div>
                <div className='w-full grid grid-cols-4 text-center font-bold border-b divide-x'>
                  <div className='size-full grid place-items-center p-1 sm:p-2 '>
                    <p>Item</p>
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <p>Qty</p>
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <p>Amount</p>
                  </div>
                  <div className='size-full grid place-items-center p-1 sm:p-2'>
                    <p>Action</p>
                  </div>
                </div>

                {fields.slice(0, -1).map((orderItem, index) => (
                  <div
                    key={fields[index].id}
                    className={`w-full grid grid-cols-4 divide-x ${fields.slice(0, -1).length - 1 !== index ? 'border-b' : ''}`}
                  >
                    <div className='size-full grid place-items-center break-all p-1 sm:p-2'>
                      <p>{orderItem.product?.productName}</p>
                    </div>
                    <div className='size-full grid place-items-center p-1 sm:p-2'>
                      <p>{orderItem.quantity}</p>
                    </div>
                    <div className='size-full grid place-items-center p-1 sm:p-2'>
                      <p>{`₹${orderItem.product?.salePrice ?? 0}`}</p>
                    </div>
                    <div className='size-full grid place-items-center p-1 sm:p-2'>
                      <i className='ri-close-line' onClick={() => removeItem(index)} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}

            <div className='w-full grid grid-cols-3 gap-2 border p-4 mt-2 rounded-lg'>
              <p className='col-span-2'>Sub Total</p>
              <p>{`₹${subTotal.toFixed(2)}`}</p>

              <p className='col-span-2'>Tax</p>
              <p>{`₹${tax.toFixed(2)}`}</p>

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
