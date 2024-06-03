'use client'

import { Navigation } from '@mui/icons-material'
import { Fab, Grid, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { useRetrospectives } from '../hooks/useRetrospectives'

import type { GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'createdAt', headerName: '回答日時', width: 200 },
  { field: 'AchievementRateCommon', headerName: '共通', width: 200 },
  { field: 'AchievementRateEngineer', headerName: 'エンジニア', width: 200 },
  {
    field: 'AchievementRateManagement',
    headerName: 'マネジメント',
    width: 200,
  },
  {
    field: 'unAchievedRules',
    headerName: '体現できなかったワークルール',
    width: 200,
    renderCell: (params) => (
      <Typography variant='body2' whiteSpace='pre-wrap'>
        {params.value}
      </Typography>
    ),
  },
]

export default function RetrospectiveAnswerList() {
  const { data, isLoading } = useRetrospectives()
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      margin='0 auto'
      height='100%'
      spacing={4}
    >
      <Grid item container justifyContent='space-between' width='960px'>
        <Grid item>
          <Typography variant='h4' fontWeight='bold'>
            回答結果一覧
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rows={data}
          hideFooter
          getRowHeight={() => 'auto'}
        />
      </Grid>
      <Grid
        item
        container
        justifyContent='end'
        alignItems='center'
        width='960px'
        position='fixed'
        bottom={20}
      >
        <Grid item pr='2rem'>
          <Fab
            variant='extended'
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <Navigation sx={{ mr: 1 }} />
            ページTOPへ
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  )
}
