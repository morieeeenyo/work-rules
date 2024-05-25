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

  const onSubmit = async () => {
    const selectedRows = gridApiRef.current?.getSelectedRows()
    const selectedRowIds = Array.from(selectedRows).map((row) => row[0])
    await onSubmitAnswer(selectedRowIds as string[]).then(() =>
      router.push('/'),
    )
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
          <Button variant='contained' onClick={onSubmit}>
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
        />
      </Grid>
      <Grid
        item
        container
        margin='auto 20% 40px auto'
        justifyContent='space-around'
        alignItems='center'
        width='20%'
      >
        <Grid item>
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
          <Button variant='contained' onClick={onSubmit}>
            送信する
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
