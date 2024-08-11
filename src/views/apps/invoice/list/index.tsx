// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports

// Component Imports
import { InvoiceType } from '@/types/adminTypes'
import InvoiceCard from './InvoiceCard'
import InvoiceListTable from './InvoiceListTable'

const InvoiceList = ({ invoiceData }: { invoiceData?: InvoiceType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <InvoiceCard />
      </Grid>
      <Grid item xs={12}>
        <InvoiceListTable invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default InvoiceList
