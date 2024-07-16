// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Types Imports
import type { CardStatsCharacterProps } from '@/types/pages/widgetTypes'

const CardStatWithImage = (props: CardStatsCharacterProps) => {
  // Props
  const { title, src, stats, titleColor, trendNumber, trend, chipText, chipColor } = props

  return (
    <Card className='relative overflow-visible mbs-8'>
      <CardContent>
        <Typography color={titleColor} className='font-medium'>
          {title}
        </Typography>
        <div className='flex items-center gap-2 pbs-4 pbe-1.5 is-1/2 flex-wrap'>
          <Typography variant='h4'>{stats}</Typography>
          {trend ? (
            <Typography color={trend === 'negative' ? 'error.main' : 'success.main'}>
              {`${trend === 'negative' ? '-' : '+'}${trendNumber}`}
            </Typography>
          ) : (
            <></>
          )}
        </div>
        {chipText && chipColor ? <Chip label={chipText} color={chipColor} variant='tonal' size='small' /> : <></>}
        <img src={src} alt={title} className='absolute block-end-0 inline-end-4 bs-44' />
      </CardContent>
    </Card>
  )
}

export default CardStatWithImage
