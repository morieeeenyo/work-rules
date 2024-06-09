'use client'

import { useState } from 'react'

import { Navigation } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Fab,
  Grid,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useParams } from 'next/navigation'

import { useSnackbarContext } from '@/app/providers/SnackBarProvider'

import { COLOR_WITH_CATEGORY } from '../../constants/color'
import { useRetrospective } from '../../hooks/useRetrospective'
import { useSetActionPlan } from '../../hooks/useSetActionPlan'

import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// NOTE: DataGrid周りは共通化してもいいかも
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
    width: 800,
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
        <Box p={0.5}>
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
        </Box>
      ) : null,
    cellClassName: 'flex flex-col items-center justify-center cursor-pointer',
  },
]

export default function RetrospectiveAnswerDetail() {
  const { id: retrospectiveId } = useParams() as { id: string }
  const { data, isLoading } = useRetrospective({ retrospectiveId })
  const { onSubmitActionPlan } = useSetActionPlan({ retrospectiveId })
  const { showSnackbar } = useSnackbarContext()
  const [actionPlan, setActionPlan] = useState<string>('')
  const [selectedWorkRuleId, setSelectedWorkRuleId] = useState<
    string | undefined
  >(undefined)

  const onSubmit = async () => {
    await onSubmitActionPlan({
      actionPlan,
      selectedWorkRuleId,
    })
      .then(() => {
        showSnackbar?.('success', '回答を送信しました')
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
          <Typography variant='h4' fontWeight='bold'>
            回答結果詳細
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction='column'
        justifyContent='space-between'
        width='960px'
      >
        <Grid item>
          <Typography variant='subtitle1'>
            回答日時: {data?.createdAt}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle1'>
            体現度(共通): {data?.AchievementRateCommon ?? 0}%
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle1'>
            体現度(エンジニア): {data?.AchievementRateEngineer ?? 0}%
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle1'>
            体現度(マネジメント): {data?.AchievementRateManagement ?? 0}%
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction='column'
        justifyContent='space-between'
        width='960px'
      >
        <Grid item>
          <Typography variant='subtitle1'>
            体現できなかったワークルール
          </Typography>
        </Grid>
        <Grid item>
          <DataGrid
            loading={isLoading}
            columns={columns}
            rows={data?.unachievedRules ?? []}
            hideFooter
            autoHeight
            getRowHeight={() => 'auto'}
            disableColumnMenu
            disableColumnFilter
          />
        </Grid>
      </Grid>
      <Grid
        item
        direction='row'
        container
        justifyContent='space-between'
        width='960px'
        columnSpacing={4}
      >
        <Grid item sm={6}>
          <Typography variant='subtitle1'>
            今週必ず達成するワークルール
          </Typography>
          <Select
            style={{
              width: '100%',
            }}
            value={selectedWorkRuleId}
            onChange={(e) => setSelectedWorkRuleId(e.target.value as string)}
          >
            {data?.unachievedRules.map((rule) => (
              <MenuItem value={rule.id} key={rule.id}>
                {rule.title}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item sm={6}>
          <Typography variant='subtitle1'>アクションプラン</Typography>
          <TextField
            multiline
            maxRows={10}
            minRows={5}
            fullWidth
            placeholder='今週実施するアクションプランを決めましょう'
            value={actionPlan}
            onChange={(e) => setActionPlan(e.target.value)}
            disabled={!selectedWorkRuleId}
            style={{
              backgroundColor: !selectedWorkRuleId
                ? 'rgba(0, 0, 0, 0.12)'
                : '#fff',
            }}
          />
          <Box mt={1} width='100%' display='flex' justifyContent='end'>
            <Button
              variant='contained'
              style={{
                marginLeft: 'auto',
              }}
              onClick={onSubmit}
              disabled={!selectedWorkRuleId || !actionPlan}
            >
              送信
            </Button>
          </Box>
        </Grid>
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
