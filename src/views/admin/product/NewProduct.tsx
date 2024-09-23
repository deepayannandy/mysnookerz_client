'use client'

// MUI Imports
import CustomAvatar from '@/@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import Form from '@components/Form'
import styled from '@emotion/styled'
import * as mui from '@mui/material'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

const Dropzone = styled(AppReactDropzone)<mui.BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const NewProduct = () => {
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  //const theme = useTheme()

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='ri-file-text-line' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='ri-close-line text-xl' />
      </IconButton>
    </ListItem>
  ))

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
          <div>
            <Typography variant='h4' className='mbe-1'>
              Add a new product
            </Typography>
            <Typography>Orders placed across your store</Typography>
          </div>
          <div className='flex flex-wrap max-sm:flex-col gap-4'>
            <Button variant='outlined' color='secondary'>
              Discard
            </Button>
            <Button variant='contained'>Publish Product</Button>
          </div>
        </div>
      </Grid>

      <Grid item xs={12}>
        <Dropzone>
          <Card>
            <CardHeader
              title='Product Image'
              //   action={
              //     <Typography component={Link} color='primary' className='font-medium'>
              //       Add media from URL
              //     </Typography>
              //   }
              sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
            />
            <CardContent>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} multiple={false} />
                <div className='flex items-center flex-col gap-2 text-center'>
                  <CustomAvatar variant='rounded' skin='light' color='secondary'>
                    <i className='ri-upload-2-line' />
                  </CustomAvatar>
                  <Typography variant='h4'>Drag and Drop Product Image Here.</Typography>
                  <Typography color='text.disabled'>or</Typography>
                  <Button variant='outlined' size='small'>
                    Browse Image
                  </Button>
                </div>
              </div>
              {files.length ? (
                <>
                  <List>{fileList}</List>
                  {/* <div className='buttons'>
                    <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                      Remove All
                    </Button>
                    <Button variant='contained'>Upload Files</Button>
                  </div> */}
                </>
              ) : null}
            </CardContent>
          </Card>
        </Dropzone>
      </Grid>

      <Grid item xs={12} md={8}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Product Information' />
              <CardContent>
                <Grid container spacing={5} className='mbe-5'>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Select Category' placeholder='FXSK123U' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Product Name' placeholder='iPhone 14' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='SKU' placeholder='FXSK123U' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Barcode' placeholder='0123-4567' />
                  </Grid>
                </Grid>
                <Typography className='mbe-1'>Description</Typography>
                <Card className='p-0 border shadow-none'>
                  <CardContent className='p-0'>
                    <TextField fullWidth id='outlined-multiline-static' multiline rows={4} />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Pricing' />
              <CardContent>
                <Form>
                  <TextField fullWidth label='Base Price' placeholder='Enter Base Price' className='mbe-5' />
                  <TextField fullWidth label='Sale Price' placeholder='$499' className='mbe-5' />

                  <Divider className='mlb-2' />
                  <div className='flex items-center justify-between'>
                    <Typography>In stock</Typography>
                    <Switch defaultChecked />
                  </div>
                </Form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Stock' />
              <CardContent>
                <Form>
                  <TextField fullWidth label='Quantity' placeholder='Enter Base Price' className='mbe-5' />
                  <TextField fullWidth label='Gross' placeholder='$499' className='mbe-5' />
                </Form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default NewProduct
