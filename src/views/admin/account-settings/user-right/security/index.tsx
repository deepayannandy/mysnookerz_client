// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ChangePassword from './ChangePassword'

const SecurityTab = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ChangePassword />
      </Grid>
      {/* <Grid item xs={12}>
        <TwoStepVerification />
      </Grid>
      <Grid item xs={12}>
        <RecentDevice />
      </Grid> */}
    </Grid>
  )
}

export default SecurityTab
