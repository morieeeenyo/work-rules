'use client'

import { useState } from 'react'

import { Navigation } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Chip, Fab, Grid, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'

import { BackLink } from '@/app/_components/BackLink'
import { useSnackbarContext } from '@/app/providers/SnackBarProvider'

import { COLOR_WITH_CATEGORY } from '../constants/color'
import { useAnswerRetrospective } from '../hooks/useAnswerRetrospective'
import { useWorkRules } from '../hooks/useWorkRules'

import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

function RenderExpandableCell(props: GridRenderCellParams) {
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
  {
    field: 'category',
    headerName: '種別',
    width: 130,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) =>
      params.value ? (
        <Chip
          label={params.value}
          style={{
            width: 'fit-content',
            lineHeight: '1',
            backgroundColor:
              COLOR_WITH_CATEGORY[
                params.value as keyof typeof COLOR_WITH_CATEGORY
              ],
          }}
        />
      ) : null,
    cellClassName: 'flex flex-col items-center justify-center cursor-pointer',
  },
]

export default function New() {
  const { data, isLoading } = useWorkRules()
  const { onSubmitAnswer, isMutating: isSubmittingAnswer } =
    useAnswerRetrospective()
  const router = useRouter()
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const { showSnackbar } = useSnackbarContext()

  const onSubmit = async () => {
    const unselectedRows = data.filter(
      (row) => !selectedRowIds.includes(row.id),
    )
    await onSubmitAnswer({
      unselectedRows,
    })
      .then(() => {
        showSnackbar?.('success', '回答を送信しました')
        router.push('/')
      })
      .catch(() => {
        showSnackbar?.('error', '回答の送信に失敗しました')
      })
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
          <Box display='flex' justifyContent='space-between'>
            <BackLink href='/' />
            <Typography variant='h4' fontWeight='bold' ml='1rem'>
              回答する
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <LoadingButton
            variant='contained'
            onClick={onSubmit}
            disabled={selectedRowIds.length === 0}
            loading={isSubmittingAnswer}
          >
            送信する
          </LoadingButton>
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
          rowSelectionModel={selectedRowIds}
          onRowSelectionModelChange={(selectedRowIds) => {
            setSelectedRowIds(selectedRowIds as string[])
          }}
          disableRowSelectionOnClick={isSubmittingAnswer}
          disableColumnMenu
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
          <LoadingButton
            variant='contained'
            onClick={onSubmit}
            disabled={selectedRowIds.length === 0}
            loading={isSubmittingAnswer}
          >
            送信する
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  )
}
