import OptionMenu from '@/@core/components/option-menu'
import { DeviceDataType } from '@/types/adminTypes'
import AddNewCard from '@components/dialogs/billing-card'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import * as mui from '@mui/material'
import { Card, Collapse, Grid, IconButton, Switch, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { toast } from 'react-toastify'

const editCardData = {
  cardNumber: '**** **** **** 4487',
  name: 'Violet Mendoza ',
  expiryDate: '04/2028',
  cardCvv: '233'
}

const DeviceCard = ({
  deviceDetails,
  getDevicesData,
  isDefault
}: {
  deviceDetails: DeviceDataType
  getDevicesData: () => void
  isDefault: boolean
}) => {
  // States
  const [expanded, setExpanded] = useState(isDefault ? true : false)
  //const [nodeData, setNodeData] = useState()

  // Vars
  const iconButtonProps: mui.IconButtonProps = {
    children: <i className='ri-edit-box-line' />,
    className: 'text-textSecondary'
  }

  const nodeDetails =
    deviceDetails?.nodes?.map((data, index) => {
      return {
        node: data,
        status: deviceDetails?.nodeStatus?.[index] ?? 0
      }
    }) ?? []

  // Hooks
  const theme = useTheme()

  const handleSwitch = async ({ deviceId, node, checked }: { deviceId: string; node: string; checked: boolean }) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/SendMqtt`,
        { topic: `${deviceId}/${node}`, message: checked ? '1' : '0' },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        getDevicesData()
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message || error?.message, { hideProgressBar: false })
    }
  }

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
                  {deviceDetails?.deviceType ?? ''}
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
              <Grid item xs={6}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2'>Device Name</Typography>
                  <Typography variant='body2'>Serial Number</Typography>
                  <Typography variant='body2'>Limited Warranty</Typography>
                  {/* <Typography variant='body2'>Type</Typography>
                  <Typography variant='body2'>Issuer</Typography>
                  <Typography variant='body2'>ID</Typography> */}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className='flex flex-col gap-1'>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    {deviceDetails?.deviceType ?? ''}
                  </Typography>
                  <Typography variant='body2' color='text.primary' className='font-medium'>
                    {deviceDetails?.deviceId ?? ''}
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
            <Card className='bg-[var(--mui-palette-customColors-bodyBg)]'>
              <div className='flex flex-col gap-4 px-5'>
                {nodeDetails.map((item, index) => (
                  <div key={index} className='flex items-center justify-between gap-4'>
                    <div className='flex flex-grow items-center gap-4'>
                      <div className='flex flex-col flex-grow gap-0.5'>
                        <Typography className='font-medium' color='text.primary'>
                          {item.node}
                        </Typography>
                      </div>
                    </div>
                    <Switch
                      defaultChecked={!!item.status}
                      onChange={event =>
                        handleSwitch({
                          deviceId: deviceDetails.deviceId,
                          node: item.node,
                          checked: event.target.checked
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Grid>
        </Grid>
      </Collapse>
    </>
  )
}

export default DeviceCard
