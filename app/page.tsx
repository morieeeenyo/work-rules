'use client'

import { Button, Grid, Typography } from '@mui/material'

export default function Home() {
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      margin='0 auto'
      width='30vw'
      height='100vh'
      spacing={4}
    >
      <Grid item>
        <Typography variant='h4' fontWeight='bold'>
          ワークルール振り返り
        </Typography>
      </Grid>
      <Grid container item spacing={2} justifyContent='space-between'>
        <Grid item>
          <Button variant='contained' color='primary' href='/workrules/new'>
            回答する
          </Button>
        </Grid>
        <Grid item>
          <Button variant='contained' color='inherit'>
            過去の回答結果を見る
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
