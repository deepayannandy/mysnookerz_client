'use client'

// React Imports
import type { ReactElement } from 'react'
import { useState } from 'react'

// MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'

// Component Imports

const CustomerRight = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab] = useState('overview')

  // const handleChange = (event: SyntheticEvent, value: string) => {
  //   setActiveTab(value)
  // }

  return (
    <>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          {/* <Grid item xs={12}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              <Tab icon={<i className='ri-user-3-line' />} value='overview' label='Overview' iconPosition='start' />
              <Tab icon={<i className='ri-lock-line' />} value='security' label='Security' iconPosition='start' />
              <Tab
                icon={<i className='ri-map-pin-line' />}
                value='addressBilling'
                label='Address & Billing'
                iconPosition='start'
              />
              <Tab
                icon={<i className='ri-notification-2-line' />}
                value='notifications'
                label='Notifications'
                iconPosition='start'
              />
            </CustomTabList>
          </Grid> */}
          <Grid item xs={12}>
            <TabPanel value={activeTab} className='p-0'>
              {tabContentList[activeTab]}
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </>
  )
}

export default CustomerRight
