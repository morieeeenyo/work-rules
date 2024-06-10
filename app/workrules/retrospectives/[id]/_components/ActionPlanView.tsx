import { Card, Grid, Typography } from '@mui/material'

import type { ActionPlan } from '@/app/workrules/types'

type Props = {
  actionPlan: ActionPlan
}

export const ActionPlanView = ({ actionPlan }: Props) => {
  return (
    <Grid
      item
      direction='row'
      container
      justifyContent='space-between'
      width='960px'
      columnSpacing={4}
    >
      <Grid item sm={6}>
        <Card
          style={{
            padding: '12px 8px',
          }}
        >
          <Typography variant='subtitle1'>
            今週必ず達成するワークルール
          </Typography>
          <Typography variant='subtitle2'>
            {actionPlan.targetWorkRule}
          </Typography>
        </Card>
      </Grid>
      <Grid item sm={6}>
        <Card
          style={{
            padding: '12px 8px',
          }}
        >
          <Typography variant='subtitle1'>アクションプラン</Typography>
          <Typography variant='subtitle2'>{actionPlan.actionPlan}</Typography>
        </Card>
      </Grid>
    </Grid>
  )
}
