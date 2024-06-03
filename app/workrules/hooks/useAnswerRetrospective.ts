import axios from 'axios'
import useSWRMutation from 'swr/mutation'

import type { Arguments } from 'swr'

export const useAnswerRetrospective = () => {
  const { trigger: onSubmitAnswer, isMutating } = useSWRMutation(
    '/api/workrules/retrospectives',
    (url: string, { arg }: { arg: Arguments }) => {
      const response = axios.post(url, arg)

      return response
    },
  )

  return {
    onSubmitAnswer,
    isMutating,
  }
}
