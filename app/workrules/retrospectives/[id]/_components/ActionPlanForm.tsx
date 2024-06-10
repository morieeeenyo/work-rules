import { LoadingButton } from '@mui/lab'
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'

import type { WorkRule } from '@/app/workrules/types'
import type { SelectProps, TextFieldProps } from '@mui/material'

// NOTE: props渡すのがしんどいのでhook-form要採用かも
type Props = {
  input: {
    targetWorkRuleId?: string
    actionPlanInput: string
  }
  targetWorkRuleOptions: WorkRule[]
  onSubmit: () => Promise<void>
  isSubmitting: boolean
  onChangeActionPlanInput: TextFieldProps['onChange']
  onChangeTargetWorkRule: SelectProps['onChange']
}

export const ActionPlanForm = ({
  input: { targetWorkRuleId, actionPlanInput },
  targetWorkRuleOptions,
  onSubmit,
  isSubmitting,
  onChangeActionPlanInput,
  onChangeTargetWorkRule,
}: Props) => {
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
        <FormControl fullWidth>
          <InputLabel required>
            今週必ず達成するワークルールを選択してください
          </InputLabel>
          <Select
            style={{
              width: '100%',
            }}
            value={targetWorkRuleId}
            onChange={onChangeTargetWorkRule}
            label='今週必ず達成するワークルールを選択してください'
          >
            {targetWorkRuleOptions.map((rule) => (
              <MenuItem value={rule.id} key={rule.id}>
                {rule.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item sm={6}>
        <FormControl fullWidth>
          <TextField
            multiline
            maxRows={10}
            minRows={5}
            fullWidth
            label='今週実施するアクションプランを決めましょう'
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
  )
}
