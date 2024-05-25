import axios from 'axios'
import { Arguments } from 'swr'
import useSWRMutation from 'swr/mutation'

export const useAnswerRetrospective = () => {
  const { trigger: onSubmitAnswer, isMutating } = useSWRMutation(
    '/api/workrules/retrospective',
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
