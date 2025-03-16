import { DeviceDataType } from '@/types/adminTypes'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import AllSwitch from '../AllSwitch'
import BaseSwitch from '../BaseSwitch'
import OnOffSwitch from '../OnOffSwitch'

const DeviceCard = ({
  deviceDetails,
  getDevicesData
}: {
  deviceDetails: DeviceDataType
  getDevicesData: () => void
}) => {
  // States
  // const [expanded, setExpanded] = useState(isDefault ? true : false)
  //const [nodeData, setNodeData] = useState()

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  // Vars
  // const iconButtonProps: mui.IconButtonProps = {
  //   children: <i className='ri-edit-box-line' />,
  //   className: 'text-textSecondary'
  // }

  const nodeDetails =
    deviceDetails?.nodes?.map((data, index) => {
      return {
        node: data,
        status: deviceDetails?.nodeStatus?.[index] ?? 0
      }
    }) ?? []

  // Hooks
  // const theme = useTheme()

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
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message || error?.message, { hideProgressBar: false })
    }
  }

  const enableOrDisable = async (deviceId: string) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/games/SendMqtt`,
        { topic: `${deviceId}/manualenable`, message: deviceDetails.isManualEnable ? '0' : '1' },
        { headers: { 'auth-token': token } }
      )
      if (response && response.data) {
        getDevicesData()
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  // return (
  //   <>
  //     <div className='flex flex-wrap justify-between items-center mlb-3 gap-y-2'>
  //       <div className='flex items-center gap-2'>
  //         <IconButton
  //           size='large'
  //           sx={{
  //             '& i': {
  //               transition: 'transform 0.3s',
  //               transform: expanded ? 'rotate(0deg)' : theme.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)'
  //             }
  //           }}
  //           onClick={() => setExpanded(!expanded)}
  //         >
  //           <i className='ri-arrow-down-s-line text-textPrimary' />
  //         </IconButton>
  //         <div className='flex items-center gap-4'>
  //           {/* <div className='flex justify-center items-center bg-[#F6F8FA] rounded-sm is-[50px] bs-[30px]'>
  //             <img
  //               src={
  //                 typeOfCard === 'Mastercard' ? mastercard : typeOfCard === 'American Express' ? americanExpress : visa
  //               }
  //               alt={typeOfCard}
  //               height={typeOfCard === 'Mastercard' ? 19 : typeOfCard === 'American Express' ? 16 : 12}
  //             />
  //           </div> */}
  //           <div className='flex flex-col gap-1'>
  //             <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
  //               <Typography color='text.primary' className='font-medium' fontSize={'18px'}>
  //                 {deviceDetails?.deviceType ?? ''}
  //               </Typography>
  //               {deviceDetails.isManualEnable ? (
  //                 <Chip variant='tonal' color='success' label='Manual Enable' size='small' />
  //               ) : (
  //                 <Chip variant='tonal' color='error' label='Manual Disable' size='small' />
  //               )}
  //             </div>
  //             <Typography>
  //               {`Expires
  //                ${
  //                  deviceDetails?.warrantyExpiryDate
  //                    ? DateTime.fromISO(deviceDetails.warrantyExpiryDate).toFormat('dd LLL yyyy')
  //                    : ''
  //                }`}
  //             </Typography>
  //           </div>
  //         </div>
  //       </div>
  //       <div className='mis-10'>
  //         <OpenDialogOnElementClick
  //           element={IconButton}
  //           elementProps={iconButtonProps}
  //           dialog={AddNewCard}
  //           dialogProps={{ data: editCardData }}
  //         />
  //         <IconButton>
  //           <i className='ri-delete-bin-7-line text-textSecondary' />
  //         </IconButton>
  //         <OptionMenu
  //           iconClassName='text-textSecondary'
  //           iconButtonProps={{ size: 'medium' }}
  //           options={[
  //             // { text: 'Download', icon: 'ri-download-line', menuItemProps: { className: 'gap-2' } },
  //             {
  //               text: deviceDetails.isManualEnable ? 'Disable' : 'Enable',
  //               menuItemProps: {
  //                 className: 'gap-2',
  //                 onClick: () => enableOrDisable(deviceDetails.deviceId)
  //               }
  //             }

  //             // { text: 'Duplicate', icon: 'ri-stack-line', menuItemProps: { className: 'gap-2' } }
  //           ]}
  //           //options={deviceDetails.isManualEnable ? ['Disable'] : ['Enable']}
  //         />
  //       </div>
  //     </div>
  //     <Collapse in={expanded} timeout={300}>
  //       <Grid container spacing={6} className='pbe-3 pis-12'>
  //         <Grid item xs={12} md={6}>
  //           <Grid container>
  //             <Grid item xs={6}>
  //               <div className='flex flex-col gap-1'>
  //                 <Typography variant='body2'>Device Name</Typography>
  //                 <Typography variant='body2'>Serial Number</Typography>
  //                 <Typography variant='body2'>Limited Warranty</Typography>
  //                 {/* <Typography variant='body2'>Type</Typography>
  //                 <Typography variant='body2'>Issuer</Typography>
  //                 <Typography variant='body2'>ID</Typography> */}
  //               </div>
  //             </Grid>
  //             <Grid item xs={6}>
  //               <div className='flex flex-col gap-1'>
  //                 <Typography variant='body2' color='text.primary' className='font-medium'>
  //                   {deviceDetails?.deviceType ?? ''}
  //                 </Typography>
  //                 <Typography variant='body2' color='text.primary' className='font-medium'>
  //                   {deviceDetails?.deviceId ?? ''}
  //                 </Typography>
  //                 <Typography variant='body2' color='text.primary' className='font-medium'>
  //                   {deviceDetails?.warrantyExpiryDate
  //                     ? DateTime.fromISO(deviceDetails.warrantyExpiryDate).toFormat('dd LLL yyyy')
  //                     : ''}
  //                 </Typography>
  //                 {/* <Typography variant='body2' color='text.primary' className='font-medium'>
  //                   {typeOfCard}
  //                 </Typography>
  //                 <Typography variant='body2' color='text.primary' className='font-medium'>
  //                   VICBANK
  //                 </Typography>
  //                 <Typography variant='body2' color='text.primary' className='font-medium'>
  //                   DH73DJ8
  //                 </Typography> */}
  //               </div>
  //             </Grid>
  //           </Grid>
  //         </Grid>
  //         <Grid item xs={12} md={6}>
  //           <Card className='bg-[var(--mui-palette-customColors-bodyBg)]'>
  //             <div className='flex flex-col gap-4 px-5'>
  //               {nodeDetails.map((item, index) => (
  //                 <div key={index} className='flex items-center justify-between gap-4'>
  //                   <div className='flex flex-grow items-center gap-4'>
  //                     <div className='flex flex-col flex-grow gap-0.5'>
  //                       <Typography className='font-medium' color='text.primary'>
  //                         {item.node}
  //                       </Typography>
  //                     </div>
  //                   </div>
  //                   <Switch
  //                     defaultChecked={!!item.status}
  //                     onChange={event =>
  //                       handleSwitch({
  //                         deviceId: deviceDetails.deviceId,
  //                         node: item.node,
  //                         checked: event.target.checked
  //                       })
  //                     }
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //           </Card>
  //         </Grid>
  //       </Grid>
  //     </Collapse>
  //   </>
  // )

  return (
    <div className='flex flex-col gap-5'>
      {/* 8 Port Device */}
      <div
        className='bg-[#1D232C] rounded-xl p-4 md:p-5 border border-white/30'
        style={{ boxShadow: '0px 4px 50px 0px #0706121A' }}
      >
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <h2 className='text-white text-[18px] font-semibold leading-[27px]'>{deviceDetails?.deviceType ?? ''}</h2>
          <div className='flex items-center gap-2.5'>
            <AllSwitch
              onChange={() => enableOrDisable(deviceDetails.deviceId)}
              value={!!deviceDetails.isManualEnable}
            />
            {/* <ResetWiFi /> */}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2.5'>
          <div className='bg-[#161B21] border border-[#2E3237] p-[15px] rounded-xl'>
            <div className='flex items-center justify-between gap-5'>
              <img src='/assets/home-automation.png' alt='box-icons' width={40} height={40} />
              <div className='flex items-center gap-1.5'>
                <h3 className='text-white text-[14px] font-normal leading-[20px]'>Status:</h3>
                <div
                  className={`${deviceDetails.isActive ? 'bg-[#07FF3533]' : 'bg-[#ff070733]'} w-fit flex items-center gap-1 rounded-[30px] p-2.5`}
                >
                  <span
                    className={`min-w-[5px] min-h-[5px] rounded-full ${deviceDetails.isActive ? 'bg-[#07FF35]' : 'bg-error'}`}
                  ></span>
                  <h3
                    className={`${deviceDetails.isActive ? 'text-[#07FF35]' : 'text-error'} text-[14px] font-normal leading-[16.41px]`}
                  >
                    {deviceDetails.isActive ? 'Online' : 'Offline'}
                  </h3>
                </div>
              </div>
            </div>

            <div className='mt-2.5 text-white'>
              <h3 className='text-[16px] font-bold leading-[20px]'>{`${deviceDetails.deviceType} Controller`}</h3>
              <ul className='mt-1 list-disc pl-5'>
                <li className='text-[14px] font-medium leading-[20px]'>
                  Device Name: <span className='font-normal'>{deviceDetails?.deviceType ?? ''}</span>
                </li>
                <li className='text-[14px] font-medium leading-[20px]'>
                  Serial Number: <span className='font-normal'>{deviceDetails?.deviceId ?? ''}</span>
                </li>
                {/* <li className='text-[14px] font-medium leading-[20px]'>
                  Firmware Version: <span className='font-normal'>CC:DB:33:44:01:74</span>
                </li> */}
                <li className='text-[14px] font-medium leading-[20px]'>
                  Limited Warranty:{' '}
                  <span className='font-normal'>
                    {deviceDetails?.warrantyExpiryDate
                      ? DateTime.fromISO(deviceDetails.warrantyExpiryDate).toFormat('dd LLL yyyy')
                      : ''}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Manual Enable/Disable */}
          <div className='bg-[#161B21] border border-[#2E3237] p-[15px] rounded-xl'>
            <div className='flex items-center justify-between gap-5'>
              <img src='/assets/setting.png' alt='box-icons' width={40} height={40} />
              <BaseSwitch
                onChange={() => enableOrDisable(deviceDetails.deviceId)}
                value={!!deviceDetails.isManualEnable}
              />
            </div>

            <div className='mt-3 text-white space-y-2.5'>
              <h3 className='text-[16px] font-bold leading-[20px]'>Manual Enable/Disable</h3>
              <p className='text-[16px] font-normal leading-[18px]'>
                {`Enabling this will activate the device's manual buttons.`}
              </p>
            </div>
          </div>

          {/* Auto Manual Enable/Disable */}
          <div className='bg-[#161B21] border border-[#2E3237] p-[15px] rounded-xl'>
            <div className='flex items-center justify-between gap-5'>
              <img src='/assets/setting.png' alt='box-icons' width={40} height={40} />
              <BaseSwitch
                onChange={() => enableOrDisable(deviceDetails.deviceId)}
                value={!!deviceDetails.isManualEnable}
              />
            </div>

            <div className='mt-3 text-white space-y-2.5'>
              <h3 className='text-[16px] font-bold leading-[20px]'>Auto Manual Enable/Disable</h3>
              <p className='text-[16px] font-normal leading-[18px]'>
                {`Enabling this activates auto mode. Manual buttons are enabled when offline and disabled when online.`}
              </p>
            </div>
          </div>
        </div>

        {/* Smart Light Box */}
        <div className='mt-2.5 grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-2.5'>
          {nodeDetails.map((light, index) => (
            <div key={index} className='bg-[#161B21] border border-[#2E3237] rounded-xl px-3.5 py-2.5'>
              <div className='space-y-[10px]'>
                <div className='flex justify-between w-full items-center gap-2 sm:gap-4'>
                  <img src='/assets/light.png' alt='box-icons' width={40} height={40} />
                  <OnOffSwitch
                    onChange={checked =>
                      handleSwitch({
                        deviceId: deviceDetails.deviceId,
                        node: light.node,
                        checked
                      })
                    }
                    value={!!light.status}
                  />
                </div>
                <h3 className='text-white text-[14px] font-semibold leading-[16.41px]'>{`Smart Light ${index + 1}`}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 
      4 Port Device */}
      {/* <div
        className='bg-[#1D232C] rounded-xl p-4 md:p-5 border border-white/30'
        style={{ boxShadow: '0px 4px 20px 0px #0706121A' }}
      >
        <div className='flex items-center flex-wrap justify-between gap-4'>
          <h2 className='text-white text-[18px] font-semibold leading-[27px]'>4 Port Device</h2>
          <div className='flex items-center gap-2.5'>
            <AllSwitch defaultChecked={true} onChange={checked => handleSwitchChange(checked, 'Switch 1')} />
            <ResetWiFi />
          </div>
        </div>

        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2.5'>
          
          <div className='bg-[#161B21] border border-[#2E3237] p-[15px] rounded-xl'>
            <div className='flex items-center justify-between gap-5'>
              <Image src='/assets/home-automation.png' alt='box-icons' width={40} height={40} />
              <div className='flex items-center gap-1.5'>
                <h3 className='text-white text-[14px] font-normal leading-[20px]'>Status:</h3>
                <div className='bg-[#07FF3533] w-fit flex items-center gap-1 rounded-[30px] p-2.5'>
                  <span className='min-w-[5px] min-h-[5px] rounded-full bg-[#07FF35]'></span>
                  <h3 className='text-[#07FF35] text-[14px] font-normal leading-[16.41px]'>Online</h3>
                </div>
              </div>
            </div>

            <div className='mt-2.5 text-white'>
              <h3 className='text-[16px] font-bold leading-[20px]'>4 Port Controller</h3>
              <ul className='mt-1 list-disc pl-5'>
                <li className='text-[14px] font-medium leading-[20px]'>
                  Device Name: <span className='font-normal'>17 Dec 2025</span>
                </li>
                <li className='text-[14px] font-medium leading-[20px]'>
                  Serial Number: <span className='font-normal'>4 Node</span>
                </li>
                <li className='text-[14px] font-medium leading-[20px]'>
                  Firmware Version: <span className='font-normal'>CC:DB:33:44:01:74</span>
                </li>
                <li className='text-[14px] font-medium leading-[20px]'>
                  Limited Warranty: <span className='font-normal'>17 Dec 2025</span>
                </li>
              </ul>
            </div>
          </div>

          
          <div className='bg-[#161B21] border border-[#2E3237] p-[15px] rounded-xl'>
            <div className='flex items-center justify-between gap-5'>
              <Image src='/assets/setting.png' alt='box-icons' width={40} height={40} />
              <EnableDisable initialState={true} />
            </div>

            <div className='mt-3 text-white space-y-2.5'>
              <h3 className='text-[16px] font-bold leading-[20px]'>Manual Enable/Disable</h3>
              <p className='text-[16px] font-normal leading-[18px]'>
                Enabling this will activate the device's manual buttons.
              </p>
            </div>
          </div>

          
          <div className='bg-[#161B21] border border-[#2E3237] p-[15px] rounded-xl'>
            <div className='flex items-center justify-between gap-5'>
              <Image src='/assets/setting.png' alt='box-icons' width={40} height={40} />
              <EnableDisable initialState={false} />
            </div>

            <div className='mt-3 text-white space-y-2.5'>
              <h3 className='text-[16px] font-bold leading-[20px]'>Auto Manual Enable/Disable</h3>
              <p className='text-[16px] font-normal leading-[18px]'>
                Enabling this activates auto mode; manual buttons are enabled when offline and disabled when online.
              </p>
            </div>
          </div>
        </div>

        
        <div className='mt-2.5 grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-2.5'>
          {smartLightsData4.map((light, index) => (
            <div key={index} className='bg-[#161B21] border border-[#2E3237] rounded-xl px-3.5 py-2.5'>
              <div className='space-y-[10px]'>
                <div className='flex justify-between w-full items-center gap-2 sm:gap-4'>
                  <Image src={light.icon || '/placeholder.svg'} alt='box-icons' width={40} height={40} />
                  <OFFONToggle initialState={light.initialState} />
                </div>
                <h3 className='text-white text-[14px] font-semibold leading-[16.41px]'>{light.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default DeviceCard
