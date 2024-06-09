import axios from 'axios'
import useSWRMutation from 'swr/mutation'

import type { SetActionPlanParams } from '@/app/api/workrules/retrospectives/[id]/actionPlans/route'

type Args = {
  retrospectiveId: string
}

export const useSetActionPlan = ({ retrospectiveId }: Args) => {
  const { trigger: onSubmitActionPlan, isMutating: isSubmitting } =
    useSWRMutation(
      `/api/workrules/retrospectives/${retrospectiveId}/actionPlans`,
      (url: string, { arg }: { arg: SetActionPlanParams }) => {
        const response = axios.post(url, arg)

        return response
      },
    )

  return {
    onSubmitActionPlan,
    isSubmitting,
  }
}
