'use client'

import { Navigation } from '@mui/icons-material'
import { Box, Button, Fab, Grid, Typography, styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { BackLink } from '@/app/_components/BackLink'

import { useRetrospectives } from '../hooks/useRetrospectives'

import type { GridColDef } from '@mui/x-data-grid'

const TableCellText = styled(Typography)`
  height: 30px;
  line-height: 30px;
  margin: auto 0;
`

const columns: GridColDef[] = [
  {
    field: 'createdAt',
    headerName: '回答日時',
    width: 150,
    cellClassName: 'flex flex-col justify-center',
    renderCell: (params) => (
      <TableCellText variant='subtitle2'>{params.value}</TableCellText>
    ),
  },
  {
    field: 'AchievementRateCommon',
    headerName: '体現度(共通)',
    align: 'center',
    headerAlign: 'center',
    width: 170,
    cellClassName: 'flex flex-col justify-center',
    renderCell: (params) => (
      <TableCellText variant='subtitle2'>{params.value}</TableCellText>
    ),
  },
  {
    field: 'AchievementRateEngineer',
    headerName: '体現度(エンジニア)',
    align: 'center',
    headerAlign: 'center',
    width: 170,
    cellClassName: 'flex flex-col justify-center',
    renderCell: (params) => (
      <TableCellText variant='subtitle2'>{params.value}</TableCellText>
    ),
  },
  {
    field: 'AchievementRateManagement',
    headerName: '体現度(マネジメント)',
    align: 'center',
    headerAlign: 'center',
    width: 170,
    cellClassName: 'flex flex-col justify-center',
    renderCell: (params) => (
      <TableCellText variant='subtitle2'>{params.value}</TableCellText>
    ),
  },
  {
    field: 'id',
    headerName: '',
    width: 200,
    align: 'center',
    cellClassName: 'h-200px',
    renderCell: (params) => (
      <Button
        variant='contained'
        color='inherit'
        href={`/workrules/retrospectives/${params.value}`}
        style={{
          margin: '0.5rem auto',
        }}
      >
        詳細を見る
      </Button>
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
        <Box display='flex' justifyContent='space-between'>
          <BackLink href='/' />
          <Typography variant='h4' fontWeight='bold' ml='1rem'>
            回答結果一覧
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rows={data}
          hideFooter
          getRowHeight={() => 'auto'}
          autoHeight
          disableColumnMenu
          disableColumnFilter
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
