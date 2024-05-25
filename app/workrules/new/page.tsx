'use client'
import { Button, Fab, Grid, Tooltip, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid'
import { useWorkRules } from '../hooks/useWorkRules'
import { useAnswerRetrospective } from '../hooks/useAnswerRetrospective'
import { useRouter } from 'next/navigation'
import { Navigation } from '@mui/icons-material'
import { useState } from 'react'

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
    cellClassName: 'flex content-center cursor-pointer',
  },
]

export default function New() {
  const { data, isLoading } = useWorkRules()
  const { onSubmitAnswer } = useAnswerRetrospective()
  const gridApiRef = useGridApiRef()
  const router = useRouter()
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const onSubmit = async () => {
    await onSubmitAnswer(selectedRowIds).then(() => router.push('/'))
  }

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
            回答する
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            onClick={onSubmit}
            disabled={selectedRowIds.length === 0}
          >
            送信する
          </Button>
        </Grid>
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
          apiRef={gridApiRef}
          rowSelectionModel={selectedRowIds}
          onRowSelectionModelChange={(params) => {
            setSelectedRowIds(params as string[])
          }}
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
        <Grid item>
          <Button
            variant='contained'
            onClick={onSubmit}
            disabled={selectedRowIds.length === 0}
          >
            送信する
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
