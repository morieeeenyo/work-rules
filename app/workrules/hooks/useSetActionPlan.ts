import axios from 'axios'
import useSWRMutation from 'swr/mutation'

import type { Arguments } from 'swr'

type Args = {
  retrospectiveId: string
}

export const useSetActionPlan = ({ retrospectiveId }: Args) => {
  const { trigger: onSubmitActionPlan, isMutating } = useSWRMutation(
    `/api/workrules/retrospectives/${retrospectiveId}/actionPlans`,
    (url: string, { arg }: { arg: Arguments }) => {
      const response = axios.post(url, arg)

      return response
    },
  )

  return {
    onSubmitActionPlan,
    isMutating,
  }
}
