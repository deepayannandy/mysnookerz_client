'use client'

import { CategoryListType, NewProductDataType } from '@/types/adminTypes'
// MUI Imports
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
// type FileProp = {
//   name: string
//   type: string
//   size: number
// }

// const Dropzone = styled(AppReactDropzone)<mui.BoxProps>(({ theme }) => ({
//   '& .dropzone': {
//     minHeight: 'unset',
//     padding: theme.spacing(12),
//     [theme.breakpoints.down('sm')]: {
//       paddingInline: theme.spacing(5)
//     },
//     '&+.MuiList-root .MuiListItem-root .file-name': {
//       fontWeight: theme.typography.body1.fontWeight
//     }
//   }
// }))

const EditProduct = ({ productId }: { productId: string }) => {
  const [quantity, setQuantity] = useState<string | number>('')
  const [restockQuantity, setRestockQuantity] = useState<string | number>('')

  const [inStockSwitch, setInStockSwitch] = useState(false)
  const [isStockRequiredSwitch, setIsStockRequiredSwitch] = useState(false)
  const [categoryList, setCategoryList] = useState([] as CategoryListType[])

  // const [files, setFiles] = useState<File[]>([])

  // Hooks
  //const theme = useTheme()

  // Hooks
  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: (acceptedFiles: File[]) => {
  //     setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
  //   }
  // })

  // const renderFilePreview = (file: FileProp) => {
  //   if (file.type.startsWith('image')) {
  //     return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
  //   } else {
  //     return <i className='ri-file-text-line' />
  //   }
  // }

  // const handleRemoveFile = (file: FileProp) => {
  //   const uploadedFiles = files
  //   const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

  //   setFiles([...filtered])
  // }

  // const fileList = files.map((file: FileProp) => (
  //   <ListItem key={file.name} className='pis-4 plb-3'>
  //     <div className='file-details'>
  //       <div className='file-preview'>{renderFilePreview(file)}</div>
  //       <div>
  //         <Typography className='file-name font-medium' color='text.primary'>
  //           {file.name}
  //         </Typography>
  //         <Typography className='file-size' variant='body2'>
  //           {Math.round(file.size / 100) / 10 > 1000
  //             ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
  //             : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
  //         </Typography>
  //       </div>
  //     </div>
  //     <IconButton onClick={() => handleRemoveFile(file)}>
  //       <i className='ri-close-line text-xl' />
  //     </IconButton>
  //   </ListItem>
  // ))

  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<NewProductDataType, '_id'>({
    defaultValues: {
      productName: '',
      description: '',
      category: '',
      barcode: '',
      sku: '',
      basePrice: '',
      salePrice: '',
      tax: '',
      quantity: '',
      isOutOfStock: false,
      isStockRequired: false
    }
  })

  const getProductData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.get(`${apiBaseUrl}/products/${productId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        resetForm(response.data)
        setQuantity(response.data.quantity)
        setInStockSwitch(!response.data.isOutOfStock)
        setIsStockRequiredSwitch(response.data.isStockRequired)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const getAllCategoryData = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/category/expense`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        const data = response.data.map((category: { _id: string; name: string }) => {
          return {
            categoryId: category._id,
            name: category.name
          }
        })

        setCategoryList(data)
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
    getProductData()
    getAllCategoryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gross = Number(getValues('basePrice') || 0) * Number(quantity || 0)
  const restockGross = Number(getValues('basePrice') || 0) * Number(restockQuantity || 0)

  const onSubmit = async (data: NewProductDataType) => {
    data.quantity = quantity
    data.isQntRequired = inStockSwitch
    data.isStockRequired = isStockRequiredSwitch

    let category = {}
    if (typeof data.category === 'string') {
      category = { name: data.category }
    } else {
      category = data.category
    }

    if (!inStockSwitch) {
      data.quantity = ''
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/products/${productId}`,
        { ...data, category },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        resetForm()
        toast.success('Product created successfully')

        const redirectUrl = `/${locale}/admin/product-list`
        return router.replace(redirectUrl)
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const handleClose = () => {
    resetForm()
    const redirectUrl = `/${locale}/admin/product-list`
    return router.replace(redirectUrl)
  }

  const handleReStock = () => {
    const updatedQuantity = Number(quantity ?? 0) + Number(restockQuantity ?? 0)
    setQuantity(updatedQuantity)
    setRestockQuantity('')
  }

  return (
    <form onSubmit={handleSubmit(data => onSubmit(data))}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <div>
              <Typography variant='h4' className='mbe-1'>
                Edit product details
              </Typography>
              <Typography>Orders placed across your store</Typography>
            </div>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
              <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
                Discard
              </Button>
              <Button variant='contained' type='submit'>
                Update Product
              </Button>
            </div>
          </div>
        </Grid>

        {/* <Grid item xs={12}>
          <Dropzone>
            <Card>
              <CardHeader
                title='Product Image'
                action={
                  <Typography component={Link} color='primary' className='font-medium'>
                    Add media from URL
                  </Typography>
                }
                sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
              />
              <CardContent>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} multiple={false} />
                  <div className='flex items-center flex-col gap-2 text-center'>
                    <CustomAvatar variant='rounded' skin='light' color='secondary'>
                      <i className='ri-upload-2-line' />
                    </CustomAvatar>
                    <Typography variant='h4'>Drag and Drop Product Image Here.</Typography>
                    <Typography color='text.disabled'>or</Typography>
                    <Button variant='outlined' size='small'>
                      Browse Image
                    </Button>
                  </div>
                </div>
                {files.length ? (
                  <>
                    <List>{fileList}</List>
                    <div className='buttons'>
                      <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                        Remove All
                      </Button>
                      <Button variant='contained'>Upload Files</Button>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </Dropzone>
        </Grid> */}

        <Grid item xs={12} md={8}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Product Information' />
                <CardContent>
                  <Grid container spacing={5} className='mbe-5'>
                    <Grid item xs={12} sm={6}>
                      {/* <FormControl fullWidth>
                        <InputLabel>Select Category</InputLabel>
                        <Select label='Select Category' value={category} onChange={e => setCategory(e.target.value)}>
                          {categoryList.map((type, index) => (
                            <MenuItem key={index} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}
                      <Controller
                        name='category'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                              e.key === 'Enter' && e.preventDefault()
                            }}
                            options={categoryList}
                            getOptionLabel={option =>
                              ((option as CategoryListType).name ?? option)?.split('(').join(' (')
                            }
                            freeSolo
                            value={value}
                            onChange={(_, value) => onChange(value)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                variant='outlined'
                                label='Category'
                                {...(errors.category && {
                                  error: true,
                                  helperText: errors.category.message || 'This field is required'
                                })}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='productName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            label='Product Name'
                            placeholder='Enter Product Name'
                            value={value}
                            onChange={onChange}
                            {...(errors.productName && {
                              error: true,
                              helperText: errors.productName.message || 'This field is required'
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='sku'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            disabled
                            label='SKU'
                            placeholder='Enter SKU'
                            inputProps={{ type: 'number', min: 0, step: 'any' }}
                            value={value}
                            onChange={onChange}
                            {...(errors.sku && {
                              error: true,
                              helperText: errors.sku.message || 'This field is required'
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='barcode'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            label='Barcode'
                            placeholder='Enter Barcode'
                            value={value}
                            onChange={onChange}
                            {...(errors.barcode && {
                              error: true,
                              helperText: errors.barcode.message || 'This field is required'
                            })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Typography className='mbe-1'>Description</Typography>
                  <Card className='p-0 border shadow-none'>
                    <CardContent className='p-0'>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder='Please provide description'
                            value={value}
                            onChange={onChange}
                            {...(errors.description && {
                              error: true,
                              helperText: errors.description.message || 'This field is required'
                            })}
                          />
                        )}
                      />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Re-Stock' />
                <CardContent>
                  <TextField
                    fullWidth
                    className='mbe-5'
                    label='Quantity'
                    inputProps={{ type: 'number', min: 0 }}
                    value={restockQuantity}
                    onChange={event => setRestockQuantity(Number(event.target.value) ? Number(event.target.value) : '')}
                  />
                  <TextField
                    disabled
                    fullWidth
                    className='mbe-5'
                    label='Gross'
                    value={restockGross ? restockGross : ''}
                  />
                  <Button variant='contained' onClick={handleReStock}>
                    ReStock
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Pricing' />
                <CardContent>
                  <Controller
                    name='basePrice'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        className='mbe-5'
                        label='Base Price'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={value}
                        onChange={onChange}
                        {...(errors.basePrice && {
                          error: true,
                          helperText: errors.basePrice.message || 'This field is required'
                        })}
                      />
                    )}
                  />

                  <Controller
                    name='salePrice'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        className='mbe-5'
                        label='Sale Price'
                        inputProps={{ type: 'number', min: 0, step: 'any' }}
                        value={value}
                        onChange={onChange}
                        {...(errors.salePrice && {
                          error: true,
                          helperText: errors.salePrice.message || 'This field is required'
                        })}
                      />
                    )}
                  />

                  <Controller
                    name='tax'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        className='mbe-5'
                        label='Tax'
                        inputProps={{ type: 'number', min: 0 }}
                        value={value}
                        onChange={onChange}
                        {...(errors.tax && {
                          error: true,
                          helperText: errors.tax.message || 'This field is required'
                        })}
                      />
                    )}
                  />

                  <Divider className='mlb-2' />
                  <div className='flex items-center justify-between'>
                    {isStockRequiredSwitch ? (
                      <>
                        <Typography>In stock</Typography>
                        <Switch checked={inStockSwitch} onChange={event => setInStockSwitch(event.target.checked)} />
                      </>
                    ) : (
                      <></>
                    )}

                    <Typography>Stock Required</Typography>
                    <Switch
                      checked={isStockRequiredSwitch}
                      onChange={event => setIsStockRequiredSwitch(event.target.checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              {inStockSwitch ? (
                <Card>
                  <CardHeader title='Stock' />
                  <CardContent>
                    <TextField
                      fullWidth
                      className='mbe-5'
                      label='Quantity'
                      inputProps={{ type: 'number', min: 0 }}
                      value={quantity}
                      onChange={event => setQuantity(Number(event.target.value) ? Number(event.target.value) : '')}
                    />
                    <TextField disabled fullWidth className='mbe-5' label='Gross' value={gross ? gross : ''} />
                  </CardContent>
                </Card>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default EditProduct
