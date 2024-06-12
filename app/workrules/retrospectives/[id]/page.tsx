'use client'

import { useState } from 'react'

import { Navigation } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Chip,
  CircularProgress,
  Fab,
  FormControl,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useParams } from 'next/navigation'

import { BackLink } from '@/app/_components/BackLink'
import { useSnackbarContext } from '@/app/providers/SnackBarProvider'

import { COLOR_WITH_CATEGORY } from '../../constants/color'
import { useActionPlan } from '../../hooks/useActionPlan'
import { useRetrospective } from '../../hooks/useRetrospective'
import { useSetActionPlan } from '../../hooks/useSetActionPlan'

import { ActionPlanForm } from './_components/ActionPlanForm'
import { ActionPlanView } from './_components/ActionPlanView'

import type { SelectChangeEvent } from '@mui/material'
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
  const { data, isLoading: isUnachievedWorkRuleLoading } = useRetrospective({
    retrospectiveId,
  })
  const { onSubmitActionPlan, isSubmitting } = useSetActionPlan({
    retrospectiveId,
  })
  const { showSnackbar } = useSnackbarContext()
  const [actionPlanInput, setActionPlanInput] = useState<string>('')
  const [targetWorkRuleId, setTargetWorkRuleId] = useState<string | undefined>(
    undefined,
  )
  const { data: actionPlan, isLoading: isActionPlanLoading } = useActionPlan({
    retrospectiveId,
  })

  const onSubmit = async () => {
    const targetWorkRule = data?.unachievedRules.find(
      (rule) => rule.id === targetWorkRuleId,
    )
    if (!targetWorkRule || !actionPlanInput) return
    await onSubmitActionPlan({
      actionPlan: actionPlanInput,
      targetWorkRule,
    })
      .then(() => {
        showSnackbar?.('success', 'アクションプランを設定しました')
      })
      .catch(() => {
        showSnackbar?.('error', 'アクションプランを設定できませんでした')
      })
  }

  const onChangeActionPlanInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActionPlanInput(e.target.value as string)
  }

  const onChangeTargetWorkRule = (e: SelectChangeEvent<unknown>) => {
    setTargetWorkRuleId(e.target.value as string)
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
        <Box display='flex' justifyContent='space-between'>
          <BackLink href='/workrules/retrospectives' />
          <Typography variant='h4' fontWeight='bold' ml='1rem'>
            回答結果詳細
          </Typography>
        </Box>
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
            loading={isUnachievedWorkRuleLoading}
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
      <Grid item container width='960px'>
        <Grid item>
          <Typography variant='subtitle1' gutterBottom>
            アクションプラン
          </Typography>
        </Grid>
        {isActionPlanLoading ? (
          <Box width='960px' display='flex' justifyContent='center'>
            <CircularProgress />
          </Box>
        ) : actionPlan ? (
          <ActionPlanView actionPlan={actionPlan} />
        ) : (
          <ActionPlanForm
            input={{ targetWorkRuleId, actionPlanInput }}
            targetWorkRuleOptions={data?.unachievedRules ?? []}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onChangeActionPlanInput={onChangeActionPlanInput}
            onChangeTargetWorkRule={onChangeTargetWorkRule}
          />
        )}
      </Grid>
      {actionPlan && (
        <Grid item container width='960px'>
          <Grid item>
            <Typography variant='subtitle1' gutterBottom>
              振り返り
            </Typography>
          </Grid>
          <Grid item direction='row' container justifyContent='space-between'>
            <FormControl fullWidth>
              <TextField
                multiline
                maxRows={10}
                minRows={5}
                fullWidth
                label='アクションプランを実施できたか振り返りましょう'
                required
                value={actionPlanInput}
                onChange={onChangeActionPlanInput}
              />
            </FormControl>
            <Box mt={1} width='100%' display='flex' justifyContent='end'>
              <LoadingButton
                variant='contained'
                style={{
                  marginLeft: 'auto',
                }}
                onClick={onSubmit}
                disabled={!targetWorkRuleId || !actionPlanInput}
                loading={isSubmitting}
              >
                送信
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      )}
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
