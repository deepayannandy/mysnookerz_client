'use client'

import { TableDataType } from '@/types/adminTypes'
import { FormControl, FormHelperText, FormLabel, MenuItem } from '@mui/material'
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
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type SwitchTableDataType = {
  nextTable: string
}

type SwitchTableInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  tableData: TableDataType
  allTablesData: TableDataType[]
  getAllTablesData: () => void
}

const SwitchTable = ({ open, setOpen, tableData, allTablesData, getAllTablesData }: SwitchTableInfoProps) => {
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()
  const allTables = allTablesData
    ?.filter(table => table._id !== tableData?._id)
    .map(table => {
      return {
        id: table._id,
        tableName: table.tableName
      }
    })

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<SwitchTableDataType>({
    defaultValues: {
      nextTable: allTables[0]?.id
    }
  })

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const onSubmit = async (data: SwitchTableDataType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/table/switchTable/switch`,
        {
          oldTable: tableData._id,
          newTable: data.nextTable
        },
        {
          headers: { 'auth-token': token }
        }
      )

      if (response && response.data) {
        getAllTablesData()
        resetForm()
        setOpen(false)
        toast.success('Table Data switched successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='xs' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:items-start pb-0'>
        <div className='text-center sm:text-start'>Switch Table</div>
        <Typography component='span' className='flex flex-col text-center'>
          Switch customers to another table
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <DialogContent className='overflow-visible flex justify-center sm:justify-start'>
          {/* <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton> */}
          <div className='flex sm:flex-row flex-col gap-2 sm:w-full justify-center sm:justify-start'>
            <div className='flex flex-col justify-start w-full'>
              <FormLabel className='font-bold'>Current Table Name</FormLabel>
              <TextField disabled size='small' value={tableData.tableName} />
            </div>

            <div className='flex flex-col justify-start w-full'>
              <FormLabel className='font-bold'>Transfer Table Name</FormLabel>
              <FormControl>
                <Controller
                  name='nextTable'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField select size='small' {...field}>
                      {allTables.map((table, index) => (
                        <MenuItem key={index} value={table.id}>
                          {table.tableName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                {errors.nextTable && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
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

export default SwitchTable
