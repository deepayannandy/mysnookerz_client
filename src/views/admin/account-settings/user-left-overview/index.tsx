'use client'

import { UserDataType } from '@/types/adminTypes'
// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserDetails from './UserDetails'
import UserPlan from './UserPlan'

const UserLeftOverview = ({ data, getUserData }: { data: UserDataType; getUserData: () => void }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserDetails data={data} />
      </Grid>
      <Grid item xs={12}>
        <UserPlan data={data} getUserData={getUserData} />
      </Grid>
    </Grid>
  )
}

export default UserLeftOverview
