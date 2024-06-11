import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Typography } from '@mui/material'

type Props = {
  href: string
}

export const BackLink: React.FC<Props> = ({ href }) => {
  return (
    <Button href={href} variant='text' color='inherit'>
      <ArrowBackIcon />
      <Typography variant='subtitle1'>戻る</Typography>
    </Button>
  )
}
