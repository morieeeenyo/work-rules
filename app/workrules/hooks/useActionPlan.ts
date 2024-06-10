import axios from 'axios'
import useSWR from 'swr'

import type { ActionPlan } from '../types'
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'

type Args = {
  retrospectiveId: string
}

export const useActionPlan = ({ retrospectiveId }: Args) => {
  const { data, isLoading } = useSWR<ActionPlan | null>(
    `/api/workrules/retrospectives/${retrospectiveId}/actionPlans`,
    async (url: string) => {
      const response = await axios.get<QueryDatabaseResponse>(url)

      console.log(response.data.results)

      const convertedResponse = response.data.results
        .map((page) => {
          if (!('properties' in page)) return null
          const properties = page.properties as PageObjectResponse['properties']

          const workRuleProperty = properties['今週達成するワークルール']
          const actionPlanProperty = properties['アクションプラン']

          return {
            id: page.id,
            targetWorkRuleId:
              workRuleProperty.type === 'relation'
                ? workRuleProperty.relation[0].id
                : '',
            actionPlan:
              actionPlanProperty.type === 'rich_text'
                ? actionPlanProperty.rich_text[0].plain_text
                : '',
          }
        })
        .filter((page) => page !== null)

      return convertedResponse.length > 0 ? convertedResponse[0] : null
    },
  )

  return { data, isLoading }
}
