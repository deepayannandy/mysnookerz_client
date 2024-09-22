'use client'

import { TableDataType } from '@/types/adminTypes'
import { FormLabel } from '@mui/material'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import _ from 'lodash'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type CopyTableDataType = {
  newTableName: string
}

type CopyTableInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  tableData: TableDataType
  getTableData: () => void
}

const CopyTableInfo = ({ open, setOpen, tableData, getTableData }: CopyTableInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CopyTableDataType>({
    defaultValues: {
      newTableName: ''
    }
  })

  useEffect(() => {
    resetForm({ newTableName: `${tableData.tableName}_copy` })
  }, [tableData, resetForm])

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: CopyTableDataType) => {
    const newTableData = {
      ..._.omit(tableData, '_id'),
      tableName: data.newTableName
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(`${apiBaseUrl}/table`, newTableData, { headers: { 'auth-token': token } })

      if (response && response.data) {
        handleClose()
        getTableData()
        toast.success('Table added successfully')
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
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='xs' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:items-start pb-0'>
        <div className='text-center sm:text-start'>Copy Table</div>
        <Typography component='span' className='flex flex-col text-center'>
          Copy table data to new table
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible flex justify-center sm:justify-start'>
          {/* <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton> */}
          <div className='flex sm:flex-row flex-col gap-2 sm:w-full justify-center sm:justify-start'>
            <div className='flex flex-col justify-start w-full'>
              <FormLabel className='font-bold'>Copying from table</FormLabel>
              <TextField disabled size='small' value={tableData.tableName} />
            </div>

            <div className='flex flex-col justify-start w-full'>
              <FormLabel className='font-bold'>New Table Name</FormLabel>
              <Controller
                name='newTableName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size='small'
                    value={value}
                    onChange={onChange}
                    {...(errors.newTableName && {
                      error: true,
                      helperText: errors.newTableName?.message || 'This field is required'
                    })}
                  />
                )}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className='justify-center sm:justify-end'>
          <Button size='small' variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
          <Button size='small' variant='contained' type='submit'>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CopyTableInfo
