'use client'
import { Grid, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useWorkRules } from '../hooks/useWorkRules'
import styled from '@emotion/styled/macro'

const RenderExpandableCell = (props: GridRenderCellParams) => {
  const { value } = props

  return (
    <Tooltip title={value}>
      <Typography
        variant='subtitle2'
        paragraph
        style={{
          whiteSpace: 'wrap',
          wordWrap: 'normal',
          margin: 'auto 0',
        }}
      >
        {value}
      </Typography>
    </Tooltip>
  )
}

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'タイトル',
    width: 1000,
    renderCell: (params: GridRenderCellParams) => (
      <RenderExpandableCell {...params} />
    ),
    cellClassName: 'flex content-center',
  },
]

export default function New() {
  const { data, isLoading } = useWorkRules()
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
      <Grid item>
        <Typography variant='h4' fontWeight='bold'>
          回答する
        </Typography>
      </Grid>
      <Grid item>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rows={data}
          checkboxSelection
          getRowHeight={() => 'auto'}
          autoHeight
          hideFooter
        />
      </Grid>
    </Grid>
  )
}
