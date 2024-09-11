'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import type { IconButtonProps } from '@mui/material/IconButton'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Component Imports
import { DeviceDataType } from '@/types/adminTypes'
import AddNewCard from '@components/dialogs/billing-card'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'

type dataType = {
  typeOfCard: string
  isDefault: boolean
  expiryDate: string
}

const data: dataType[] = [
  {
    typeOfCard: 'Mastercard',
    isDefault: true,
    expiryDate: 'Apr 2028'
  },
  {
    typeOfCard: 'American Express',
    isDefault: false,
    expiryDate: 'Jan 2025'
  },
  {
    typeOfCard: 'Visa',
    isDefault: false,
    expiryDate: 'Nov 2030'
  }
]

// Vars
const editCardData = {
  cardNumber: '**** **** **** 4487',
  name: 'Violet Mendoza ',
  expiryDate: '04/2028',
  cardCvv: '233'
}

const DeviceCard = ({ deviceDetails, isDefault }: { deviceDetails: DeviceDataType; isDefault: boolean }) => {
  // States
  const [expanded, setExpanded] = useState(isDefault ? true : false)

  // Vars
  const iconButtonProps: IconButtonProps = {
    children: <i className='ri-edit-box-line' />,
    className: 'text-textSecondary'
  }

  // Hooks
  const theme = useTheme()

  // const mastercard = '/images/apps/ecommerce/mastercard.png'
  // const americanExpress = '/images/apps/ecommerce/american-express.png'
  // const visa = '/images/apps/ecommerce/visa.png'

  return (
    <>
      <div className='flex flex-wrap justify-between items-center mlb-3 gap-y-2'>
        <div className='flex items-center gap-2'>
          <IconButton
            size='large'
            sx={{
              '& i': {
                transition: 'transform 0.3s',
                transform: expanded ? 'rotate(0deg)' : theme.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)'
              }
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <i className='ri-arrow-down-s-line text-textPrimary' />
          </IconButton>
          <div className='flex items-center gap-4'>
            {/* <div className='flex justify-center items-center bg-[#F6F8FA] rounded-sm is-[50px] bs-[30px]'>
              <img
                src={
                  typeOfCard === 'Mastercard' ? mastercard : typeOfCard === 'American Express' ? americanExpress : visa
                }
                alt={typeOfCard}
                height={typeOfCard === 'Mastercard' ? 19 : typeOfCard === 'American Express' ? 16 : 12}
              />
            </div> */}
            <div className='flex flex-col gap-1'>
              <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                <Typography color='text.primary' className='font-medium'>
                  {deviceDetails?.deviceName ?? ''}
                </Typography>
                {/* {isDefault && <Chip variant='tonal' color='success' label='Default Card' size='small' />} */}
              </div>
              <Typography>
                {`Expires
                 ${
                   deviceDetails?.warrantyExpiryDate
                     ? DateTime.fromISO(deviceDetails.warrantyExpiryDate).toFormat('dd LLL yyyy')
                     : ''
                 }`}
              </Typography>
            </div>
          </div>
        </div>
        <div className='mis-10'>
          <OpenDialogOnElementClick
            element={IconButton}
            elementProps={iconButtonProps}
            dialog={AddNewCard}
            dialogProps={{ data: editCardData }}
          />
          <IconButton>
            <i className='ri-delete-bin-7-line text-textSecondary' />
          </IconButton>
          <OptionMenu
            iconClassName='text-textSecondary'
            iconButtonProps={{ size: 'medium' }}
            options={['Set as Default Card']}
          />
        </div>
      </div>
      <Collapse in={expanded} timeout={300}>
        <Grid container spacing={6} className='pbe-3 pis-12'>
          <Grid item xs={12} md={6}>
            <Grid container>
              <Grid item xs={4}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2'>Device Name</Typography>
                  <Typography variant='body2'>Serial Number</Typography>
                  <Typography variant='body2'>Limited Warranty</Typography>
                  {/* <Typography variant='body2'>Type</Typography>
                  <Typography variant='body2'>Issuer</Typography>
                  <Typography variant='body2'>ID</Typography> */}
                </div>
              </Grid>
              <Grid item xs={8}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    {deviceDetails?.deviceName ?? ''}
                  </Typography>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    {deviceDetails?.serialNumber ?? ''}
                  </Typography>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    {deviceDetails?.warrantyExpiryDate
                      ? DateTime.fromISO(deviceDetails.warrantyExpiryDate).toFormat('dd LLL yyyy')
                      : ''}
                  </Typography>
                  {/* <Typography variant='body2' color='text.primary' className='font-medium'>
                    {typeOfCard}
                  </Typography>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    VICBANK
                  </Typography>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    DH73DJ8
                  </Typography> */}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container>
              <Grid item xs={4}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2'>Billing</Typography>
                  <Typography variant='body2'>Number</Typography>
                  <Typography variant='body2'>Email</Typography>
                  <Typography variant='body2'>Origin</Typography>
                  <Typography variant='body2'>CVC</Typography>
                </div>
              </Grid>
              <Grid item xs={8}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    USA
                  </Typography>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    +7634 983 637
                  </Typography>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    vafgot@vultukir.org
                  </Typography>
                  <div className='flex gap-2'>
                    <Typography variant='body2' color='text.primary' className='font-medium'>
                      United States
                    </Typography>
                    <img src='/images/cards/us.png' height={20} />
                  </div>
                  <div className='flex gap-2'>
                    <Typography variant='body2' color='text.primary' className='font-medium'>
                      Passed
                    </Typography>
                    <CustomAvatar skin='light' size={20} color='success'>
                      <i className='ri-check-line text-xs' />
                    </CustomAvatar>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Collapse>
    </>
  )
}

const DeviceDataCards = () => {
  const [data, setData] = useState([] as DeviceDataType[])

  // Vars
  const buttonProps: ButtonProps = {
    variant: 'outlined',
    children: '+ Add Device',
    size: 'small'
  }

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getDevicesData = async () => {
    setData([
      {
        deviceName: 'Nod2-8',
        serialNumber: 'ewrwad123123',
        warrantyExpiryDate: '2024-10-27'
      },
      {
        deviceName: 'Nod1-9',
        serialNumber: '123asda123',
        warrantyExpiryDate: '2024-12-29'
      },
      {
        deviceName: 'Nod4',
        serialNumber: 'q12321sda',
        warrantyExpiryDate: '2024-11-30'
      }
    ])
    // const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    // const token = localStorage.getItem('token')
    // try {
    //   const response = await axios.get(`${apiBaseUrl}/devices`, { headers: { 'auth-token': token } })
    //   if (response && response.data) {
    //     setData(response.data)
    //   }
    // } catch (error: any) {
    //   if (error?.response?.status === 401) {
    //     const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
    //     return router.replace(redirectUrl)
    //   }
    //   toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    // }
  }

  useEffect(() => {
    getDevicesData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader
        title='Devices'
        action={<OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={AddNewCard} />}
        className='flex-wrap gap-4'
      />
      <CardContent>
        {data.map((deviceDetails, index) => (
          <div key={index}>
            <DeviceCard deviceDetails={deviceDetails} isDefault={index === 0} />
            {index !== data.length - 1 && <Divider />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default DeviceDataCards
