import axios from 'axios'
import useSWRMutation from 'swr/mutation'

import type { CreateActionPlanRetrospectiveParams } from '@/app/api/workrules/retrospectives/[id]/actionPlans/[actionPlanId]/retrospectives/route'

type Args = {
  retrospectiveId: string
  actionPlanId: string
}

export const useCreateActionPlanRetrospective = ({
  retrospectiveId,
  actionPlanId,
}: Args) => {
  const { trigger: onSubmitActionPlanRetrospective, isMutating: isSubmitting } =
    useSWRMutation(
      `/api/workrules/retrospectives/${retrospectiveId}/actionPlans/${actionPlanId}/retrospectives`,
      (url: string, { arg }: { arg: CreateActionPlanRetrospectiveParams }) => {
        const response = axios.post(url, arg)

        return response
      },
    )

  return {
    onSubmitActionPlanRetrospective,
    isSubmitting,
  }
}
