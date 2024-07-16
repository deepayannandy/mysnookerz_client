import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts') as any, { ssr: false })

export default Chart
