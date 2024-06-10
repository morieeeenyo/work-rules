import axios from 'axios'
import useSWR from 'swr'

import { getPageTitle } from '@/app/utils/notion'

import type { ActionPlan, RelationPropertyWithDetail } from '../types'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

type Args = {
  retrospectiveId: string
}

export const useActionPlan = ({ retrospectiveId }: Args) => {
  const { data, isLoading } = useSWR<ActionPlan | null>(
    `/api/workrules/retrospectives/${retrospectiveId}/actionPlans`,
    async (url: string) => {
      const response = await axios.get<PageObjectResponse>(url)

      if (!('properties' in response.data)) return null

      const properties = response.data.properties

      const actionPlanProperty = properties['アクションプラン']
      const targetWorkRuleProperty = properties[
        '今週達成するワークルール'
      ] as RelationPropertyWithDetail

      if (!actionPlanProperty || !targetWorkRuleProperty) return null

      const targetWorkRule = targetWorkRuleProperty.relation
        .map((page) => {
          if (!('properties' in page)) return null
          return getPageTitle(page.properties['ルール'])
        })
        .filter((page) => page !== null)[0]

      return {
        id: response.data.id,
        targetWorkRule: targetWorkRule ?? '',
        actionPlan:
          actionPlanProperty.type === 'rich_text'
            ? actionPlanProperty.rich_text[0].plain_text
            : '',
      }
    },
  )

  console.log(data)

  return { data, isLoading }
}
