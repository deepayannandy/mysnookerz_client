'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// Style Imports
import '@/libs/styles/tiptapEditor.css'
import { StoreDataType } from '@/types/adminTypes'
import { FormControlLabel, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type MasterControlDataType = {
  defaultCustomer: boolean
}

const MasterControl = ({ storeData, getStoreData }: { storeData: StoreDataType; getStoreData: () => void }) => {
  const [isDefaultCustomerSwitch, setIsDefaultCustomerSwitch] = useState(true)

  //Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const { handleSubmit } = useForm<MasterControlDataType>({})

  useEffect(() => {
    setIsDefaultCustomerSwitch(!!storeData?.StoreData?.defaultCustomer)
  }, [storeData])

  const onSubmit = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const storeId = localStorage.getItem('storeId')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/store/${storeId}`,
        { defaultCustomer: isDefaultCustomerSwitch },
        { headers: { 'auth-token': token } }
      )
      if (response && response.data) {
        getStoreData()
        toast.success('Master control updated successfully')
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Card>
      <CardHeader title='Master Control' />
      <form onSubmit={handleSubmit(() => onSubmit())}>
        <CardContent>
          <Grid container spacing={5} className='mbe-5'>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    onChange={e => setIsDefaultCustomerSwitch(e.target.checked)}
                    checked={isDefaultCustomerSwitch}
                  />
                }
                label='Default Customer'
              />
            </Grid>
            <Grid item xs={12}>
              <div className='flex justify-end'>
                <Button variant='contained' type='submit'>
                  Submit
                </Button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </form>
    </Card>
  )
}

export default MasterControl
