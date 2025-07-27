'use client'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { MembershipDataType, ProductDataType } from '@/types/adminTypes'
import { FormControlLabel, Checkbox, Autocomplete } from '@mui/material'
// MUI Imports
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'

type EditMembershipDataType = {
  _id: string
  membershipName: string
  type: string
  balanceMinute: number | string
  validity: number | string
  amount: number | string
  dailyLimit: number | string
  startTime: Date
  endTime: Date
  order: {
    product: ProductDataType
    quantity: number | string
  }[]
}

type EditMembershipProps = {
  open: boolean
  setOpen: (open: boolean) => void
  membershipData: MembershipDataType
  getMembershipData: () => void
}

const EditMembership = ({ open, setOpen, membershipData, getMembershipData }: EditMembershipProps) => {
  const [isDailyLimitSelected, setIsDailyLimitSelected] = useState(false)
  const [productList, setProductList] = useState([] as ProductDataType[])
  const [fieldIndex, setFieldIndex] = useState(0)
  // States

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
  } = useForm<EditMembershipDataType>({
    defaultValues: {
      balanceMinute: '',
      validity: '',
      amount: '',
      dailyLimit: '',
      startTime: new Date(),
      endTime: new Date(),
      order: []
    }
  })

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

  useEffect(() => {
    getAllProductsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    const order = membershipData.cafeItems?.map(item => {
      const product = productList.find(products => products._id === item.itemId)

      return {
        product,
        quantity: item.itemCount
      }
    })

    resetForm({
      ...membershipData,
      startTime: membershipData?.startTime ? DateTime.fromISO(membershipData?.startTime).toJSDate() : new Date(),
      endTime: membershipData?.endTime ? DateTime.fromISO(membershipData?.endTime).toJSDate() : new Date(),
      order
    })

    setFieldIndex(order?.length ?? 1)
    append({ product: productList[0], quantity: 1 })
    setIsDailyLimitSelected(!!membershipData?.dailyLimit)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList, membershipData])

  const handleClose = () => {
    resetForm()
    setIsDailyLimitSelected(false)
    setFieldIndex(0)
    setOpen(false)
  }

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

  const onSubmit = async (data: EditMembershipDataType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    let time = {}
    if (['Academy', 'Custom'].includes(membershipData.type)) {
      const startTime = DateTime.fromJSDate(data.startTime).toFormat('HH:mm')
      const endTime = DateTime.fromJSDate(data.endTime).toFormat('HH:mm')
      time = { startTime, endTime }
    }

    let cafeItems = {}
    if (['VIP'].includes(membershipData.type) && data.order?.length) {
      data.order = data.order?.slice(0, -1)
      const items = data.order.map(item => {
        return {
          itemName: item.product.productName,
          itemId: item.product._id,
          itemCount: item.quantity
        }
      })

      cafeItems = { cafeItems: items }
    }

    const request = _.omit(data, 'startTime', 'endTime', 'order')

    if (!isDailyLimitSelected) {
      request.dailyLimit = ''
    }

    try {
      const response = await axios.patch(
        `${apiBaseUrl}/membership/${membershipData._id}`,
        { ...request, ...time, ...cafeItems },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getMembershipData()
        handleClose()
        toast.success('Membership info updated successfully')
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
        <Typography variant='h5'>Edit Membership</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            <TextField disabled={true} fullWidth label='Type' value={membershipData?.type ?? ''} />

            {membershipData?.membershipName?.split('-')?.length > 1 ? (
              <TextField
                disabled={true}
                fullWidth
                label='Sub Type'
                value={membershipData?.membershipName?.split('-')?.[1]}
              />
            ) : (
              <></>
            )}
            <TextField disabled={true} fullWidth label='Membership Name' value={membershipData?.membershipName ?? ''} />

            <Controller
              name='validity'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Validity'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value ?? ''}
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
                  value={value ?? ''}
                  onChange={event => {
                    onChange(event)
                  }}
                  {...(errors.amount && { error: true, helperText: errors.amount.message })}
                />
              )}
            />

            {['Academy', 'Custom'].includes(membershipData?.type) ? (
              <>
                <Controller
                  name='startTime'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='hh:mm aa'
                      boxProps={{ className: 'is-full' }}
                      selected={value}
                      onChange={onChange}
                      customInput={
                        <TextField
                          label='Start Time'
                          size='small'
                          fullWidth
                          {...(errors.startTime && {
                            error: true,
                            helperText: errors.startTime.message || 'This field is required'
                          })}
                        />
                      }
                    />
                  )}
                />

                <Controller
                  name='endTime'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='hh:mm aa'
                      boxProps={{ className: 'is-full' }}
                      selected={value}
                      onChange={onChange}
                      customInput={
                        <TextField
                          label='End Time'
                          size='small'
                          fullWidth
                          {...(errors.endTime && {
                            error: true,
                            helperText: errors.endTime.message || 'This field is required'
                          })}
                        />
                      }
                    />
                  )}
                />
              </>
            ) : (
              <></>
            )}

            {['Prime', 'VIP'].includes(membershipData?.type) ? (
              <Controller
                name='balanceMinute'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label='Balance Minute'
                    inputProps={{ type: 'number', min: 0 }}
                    value={value ?? ''}
                    onChange={event => {
                      onChange(event)
                    }}
                    {...(errors.balanceMinute && { error: true, helperText: errors.balanceMinute.message })}
                  />
                )}
              />
            ) : (
              <></>
            )}

            {'Prime' === membershipData?.type ? (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDailyLimitSelected}
                      onChange={event => setIsDailyLimitSelected(event.target.checked)}
                    />
                  }
                  label='Set Daily Limit'
                />

                {isDailyLimitSelected ? (
                  <Controller
                    name='dailyLimit'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Daily Limit'
                        inputProps={{ type: 'number', min: 0 }}
                        value={value ?? ''}
                        onChange={event => {
                          onChange(event)
                        }}
                        {...(errors.dailyLimit && { error: true, helperText: errors.dailyLimit.message })}
                      />
                    )}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {'VIP' === membershipData?.type ? (
              <>
                {' '}
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
              </>
            ) : (
              <></>
            )}

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

export default EditMembership
