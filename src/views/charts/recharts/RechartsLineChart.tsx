'use client'

// React Imports
import type { SyntheticEvent } from 'react'
import { useRef, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Component Imports
import type { TooltipProps } from '@/libs/Recharts'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from '@/libs/Recharts'

// Styled Component Imports
import AppRecharts from '../../../libs/styles/AppRecharts'

// Vars
// let data = [
//   { pv: 980, name: 'Jan' },
//   { pv: 200, name: 'Feb' },
//   { pv: 220, name: 'Mar' },
//   { pv: 180, name: 'Apr' },
//   { pv: 270, name: 'May' },
//   { pv: 250, name: 'Jun' },
//   { pv: 70, name: 'Jul' },
//   { pv: 90, name: 'Aug' },
//   { pv: 200, name: 'Sep' },
//   { pv: 150, name: 'Oct' },
//   { pv: 160, name: 'Nov' },
//   { pv: 100, name: 'Dec' }
// ]

const monthOptions = ['Month', 'Year']

//const yearOptions = ['2023', '2024']

const CustomTooltip = (props: TooltipProps<any, any>) => {
  // Props
  const { active, payload } = props

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography fontSize='0.875rem' color='text.primary'>{`${payload[0].value}`}</Typography>
      </div>
    )
  }

  return null
}

// const YearButton = () => {
//   // States
//   const [open, setOpen] = useState<boolean>(false)
//   const [selectedIndex, setSelectedIndex] = useState<number>(0)

//   // Refs
//   const anchorRef = useRef<HTMLDivElement | null>(null)

//   const handleMenuItemClick = (event: SyntheticEvent, index: number) => {
//     setSelectedIndex(index)
//     setOpen(false)
//     data = [
//       { pv: 980, name: '7/12' },
//       { pv: 200, name: '8/12' },
//       { pv: 220, name: '9/12' },
//       { pv: 180, name: '10/12' },
//       { pv: 270, name: '11/12' },
//       { pv: 250, name: '12/12' },
//       { pv: 70, name: '13/12' },
//       { pv: 90, name: '14/12' },
//       { pv: 200, name: '15/12' },
//       { pv: 150, name: '16/12' },
//       { pv: 160, name: '17/12' },
//       { pv: 100, name: '18/12' },
//       { pv: 150, name: '19/12' },
//       { pv: 100, name: '20/12' },
//       { pv: 50, name: '21/12' }
//     ]
//   }

//   const handleToggle = () => {
//     setOpen(prevOpen => !prevOpen)
//   }

//   const handleClose = () => {
//     setOpen(false)
//   }

//   return (
//     <>
//       <ButtonGroup variant='outlined' ref={anchorRef} aria-label='split button' size='small'>
//         <Button>{yearOptions[selectedIndex]}</Button>
//         <Button
//           className='pli-0'
//           aria-haspopup='menu'
//           onClick={handleToggle}
//           aria-label='select merge strategy'
//           aria-expanded={open ? 'true' : undefined}
//           aria-controls={open ? 'split-button-menu' : undefined}
//         >
//           <i className='ri-arrow-down-s-line text-lg' />
//         </Button>
//       </ButtonGroup>
//       <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition placement='bottom-end'>
//         {({ TransitionProps, placement }) => (
//           <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
//             <Paper className='shadow-lg'>
//               <ClickAwayListener onClickAway={handleClose}>
//                 <MenuList id='split-button-menu'>
//                   {yearOptions.map((yearOption, index) => (
//                     <MenuItem
//                       key={yearOption}
//                       selected={index === selectedIndex}
//                       onClick={event => handleMenuItemClick(event, index)}
//                     >
//                       {yearOption}
//                     </MenuItem>
//                   ))}
//                 </MenuList>
//               </ClickAwayListener>
//             </Paper>
//           </Grow>
//         )}
//       </Popper>
//     </>
//   )
// }

const RechartsLineChart = ({ title }: { title: string }) => {
  // Hooks
  const theme = useTheme()

  const [data, setData] = useState<{ pv: number; name: string }[]>([
    { pv: 980, name: 'Jan' },
    { pv: 200, name: 'Feb' },
    { pv: 220, name: 'Mar' },
    { pv: 180, name: 'Apr' },
    { pv: 270, name: 'May' },
    { pv: 250, name: 'Jun' },
    { pv: 70, name: 'Jul' },
    { pv: 90, name: 'Aug' },
    { pv: 200, name: 'Sep' },
    { pv: 150, name: 'Oct' },
    { pv: 160, name: 'Nov' },
    { pv: 100, name: 'Dec' }
  ])

  const MonthButton = () => {
    // States
    const [open, setOpen] = useState<boolean>(false)
    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    // Refs
    const anchorRef = useRef<HTMLDivElement | null>(null)

    const handleMenuItemClick = (event: SyntheticEvent, index: number) => {
      setSelectedIndex(index)
      setOpen(false)
      setData([
        { pv: 980, name: '2022' },
        { pv: 200, name: '2023' },
        { pv: 220, name: '2024' }
      ])
    }

    const handleToggle = () => {
      setOpen(prevOpen => !prevOpen)
    }

    const handleClose = () => {
      setOpen(false)
    }

    return (
      <>
        <ButtonGroup variant='outlined' ref={anchorRef} aria-label='split button' size='small'>
          <Button>{monthOptions[selectedIndex]}</Button>
          <Button
            className='pli-0'
            aria-haspopup='menu'
            onClick={handleToggle}
            aria-label='select merge strategy'
            aria-expanded={open ? 'true' : undefined}
            aria-controls={open ? 'split-button-menu' : undefined}
          >
            <i className='ri-arrow-down-s-line text-lg' />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition placement='bottom-end'>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}
            >
              <Paper className='shadow-lg'>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id='split-button-menu'>
                    {monthOptions.map((monthOption, index) => (
                      <MenuItem
                        key={monthOption}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        {monthOption}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    )
  }

  return (
    <Card>
      <CardHeader
        title={title}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={<MonthButton />}
      />
      <CardContent>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <LineChart height={350} data={data} style={{ direction: theme.direction }} margin={{ left: -20 }}>
                <CartesianGrid />
                <XAxis dataKey='name' reversed={theme.direction === 'rtl'} />
                <YAxis orientation={theme.direction === 'rtl' ? 'right' : 'left'} />
                <Tooltip content={CustomTooltip} />
                <Line dataKey='pv' stroke='#ff9f43' strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </CardContent>
    </Card>
  )
}

export default RechartsLineChart
