'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Types Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionsMenu from '@core/components/option-menu'

// Styled Component Imports
import { DashboardTotalRevenueDataType } from '@/types/staffTypes'
import { useEffect, useState } from 'react'

import AppReactApexCharts from '../../../libs/styles/AppReactApexCharts'

interface DataType {
  title: string
  icon: string
  subtitle: string
  avatarColor: ThemeColor
}

const TotalRevenueStackedBar = () => {
  // Hooks
  const theme = useTheme()

  const [revenueData, setRevenueData] = useState({} as DashboardTotalRevenueDataType)

  const getTotalRevenueData = async (timePeriod = 'all') => {
    let testData = {
      totalRevenue: 1532783,
      totalDiscounts: 123123,
      totalExpense: 2323,
      totalProfit: 123123,
      lastMonthBalance: 1312312,
      timePeriods: ['2018', '2019', '2020', '2021', '2022'],
      discounts: [
        {
          timePeriod: '2016',
          value: 400
        },
        {
          timePeriod: '2017',
          value: 500
        },
        {
          timePeriod: '2018',
          value: 123
        },
        {
          timePeriod: '2019',
          value: 133
        },
        {
          timePeriod: '2020',
          value: 132
        },
        {
          timePeriod: '2021',
          value: 355
        },
        {
          timePeriod: '2022',
          value: 466
        },
        {
          timePeriod: '2023',
          value: 346
        },
        {
          timePeriod: '2024',
          value: 120
        }
      ],
      expense: [
        {
          timePeriod: '2016',
          value: 199
        },
        {
          timePeriod: '2017',
          value: 533
        },
        {
          timePeriod: '2018',
          value: 353
        },
        {
          timePeriod: '2019',
          value: 345
        },
        {
          timePeriod: '2020',
          value: 534
        },
        {
          timePeriod: '2021',
          value: 345
        },
        {
          timePeriod: '2022',
          value: 364
        },
        {
          timePeriod: '2023',
          value: 347
        },
        {
          timePeriod: '2024',
          value: 456
        }
      ],
      profit: [
        {
          timePeriod: '2016',
          value: 450
        },
        {
          timePeriod: '2017',
          value: 345
        },
        {
          timePeriod: '2018',
          value: 546
        },
        {
          timePeriod: '2019',
          value: 455
        },
        {
          timePeriod: '2020',
          value: 234
        },
        {
          timePeriod: '2021',
          value: 456
        },
        {
          timePeriod: '2022',
          value: 435
        },
        {
          timePeriod: '2023',
          value: 545
        },
        {
          timePeriod: '2024',
          value: 454
        }
      ]
    }
    if (timePeriod === 'currentYear') {
      testData = {
        totalRevenue: 1532783,
        totalDiscounts: 123123,
        totalExpense: 2323,
        totalProfit: 123123,
        lastMonthBalance: 1312312,
        timePeriods: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        discounts: [
          {
            timePeriod: 'Jan',
            value: 400
          },
          {
            timePeriod: 'Feb',
            value: 500
          },
          {
            timePeriod: 'Mar',
            value: 123
          },
          {
            timePeriod: 'Apr',
            value: 133
          },
          {
            timePeriod: 'May',
            value: 132
          }
        ],
        expense: [
          {
            timePeriod: 'Jan',
            value: 199
          },
          {
            timePeriod: 'Feb',
            value: 533
          },
          {
            timePeriod: 'Mar',
            value: 353
          },
          {
            timePeriod: 'Apr',
            value: 345
          },
          {
            timePeriod: 'May',
            value: 534
          }
        ],
        profit: [
          {
            timePeriod: 'Jan',
            value: 450
          },
          {
            timePeriod: 'Feb',
            value: 345
          },
          {
            timePeriod: 'Mar',
            value: 546
          },
          {
            timePeriod: 'Apr',
            value: 455
          },
          {
            timePeriod: 'May',
            value: 234
          }
        ]
      }
    }

    setRevenueData(testData)
    // const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    // const token = localStorage.getItem('token')
    // try {
    //   const response = await axios.get(`${apiBaseUrl}/history/`, { headers: { 'auth-token': token } })
    //   if (response && response.data) {
    //     setRevenueData(response.data)
    //   }
    // } catch (error: any) {
    //   // if (error?.response?.status === 409) {
    //   //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
    //   //   return router.replace(redirectUrl)
    //   // }
    //   toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    // }
  }

  useEffect(() => {
    getTotalRevenueData('currentYear')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const data: DataType[] = [
    {
      title: `₹${revenueData?.totalDiscounts ?? 0}`,
      avatarColor: 'success',
      subtitle: 'Total Discounts',
      icon: 'ri-pie-chart-2-line'
    },
    {
      title: `₹${revenueData?.totalExpense ?? 0}`,
      avatarColor: 'primary',
      subtitle: 'Total Expense',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      title: `₹${revenueData?.totalProfit ?? 0}`,
      avatarColor: 'secondary',
      subtitle: 'Total Profit',
      icon: 'ri-bank-card-line'
    }
  ]

  const seriesValues = {
    discounts: [] as number[],
    expense: [] as number[],
    profit: [] as number[]
  }

  revenueData?.timePeriods?.map(time => {
    const discountData = revenueData?.discounts?.find(data => data.timePeriod === time)
    const expenseData = revenueData?.expense?.find(data => data.timePeriod === time)
    const profitData = revenueData?.profit?.find(data => data.timePeriod === time)

    seriesValues.discounts.push(discountData?.value ?? 0)
    seriesValues.expense.push(expenseData?.value ?? 0)
    seriesValues.profit.push(profitData?.value ?? 0)
  })

  const series = [
    {
      name: 'Expense',
      data: seriesValues.expense
    },
    {
      name: 'Discounts',
      data: seriesValues.discounts
    },
    {
      name: 'Profit',
      data: seriesValues.profit
    }
  ]

  const disabledText = 'var(--mui-palette-text-disabled)'

  const options: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '35%',
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all'
      }
    },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-success-main)', 'var(--mui-palette-secondary-main)'],
    grid: {
      strokeDashArray: 10,
      padding: { top: -20, left: -3, bottom: -10 },
      xaxis: {
        lines: { show: false }
      },
      borderColor: 'var(--mui-palette-divider)'
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 6,
      curve: 'smooth',
      lineCap: 'round',
      colors: ['var(--mui-palette-background-paper)']
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: revenueData?.timePeriods ?? [],
      labels: {
        style: { colors: disabledText, fontSize: theme.typography.body2.fontSize as string }
      }
    },
    yaxis: {
      labels: {
        offsetY: 2,
        offsetX: -15,
        formatter: (value: number) => (value > 999 ? `${(value / 1000).toFixed(0)}k` : `${value}`),
        style: { colors: disabledText, fontSize: theme.typography.body2.fontSize as string }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: { bar: { columnWidth: '42%' } }
        }
      },
      {
        breakpoint: 1370,
        options: {
          plotOptions: { bar: { columnWidth: '50%' } }
        }
      },
      {
        breakpoint: 900,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '42%'
            }
          }
        }
      },
      {
        breakpoint: 785,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '50%'
            }
          }
        }
      },
      {
        breakpoint: 700,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '60%'
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '45%'
            }
          }
        }
      },
      {
        breakpoint: 500,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '60%'
            }
          }
        }
      },
      {
        breakpoint: 400,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '65%'
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} sm={7} className='border-be sm:border-be-0 sm:border-ie'>
          <CardHeader title='Total Revenue' />
          <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
            <AppReactApexCharts type='bar' width='100%' height={292} series={series} options={options} />
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={5}>
          <CardHeader
            title={`₹${revenueData?.totalRevenue ?? 0}`}
            subheader={`Last month balance ₹${revenueData?.lastMonthBalance ?? 0}`}
            action={
              <OptionsMenu iconClassName='text-textPrimary' options={['Last 28 Days', 'Last Month', 'Last Year']} />
            }
          />
          <CardContent className='flex flex-col gap-6 !pbs-2.5'>
            {data.map((item: DataType, index: number) => {
              return (
                <div key={index} className='flex items-center gap-3'>
                  <CustomAvatar skin='light' variant='rounded' color={item.avatarColor}>
                    <i className={item.icon} />
                  </CustomAvatar>
                  <div className='flex flex-col gap-1'>
                    <Typography className='font-medium' color='text.primary'>
                      {item.title}
                    </Typography>
                    <Typography>{item.subtitle}</Typography>
                  </div>
                </div>
              )
            })}
            {/* <Button fullWidth variant='contained'>
              View Report
            </Button> */}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default TotalRevenueStackedBar
