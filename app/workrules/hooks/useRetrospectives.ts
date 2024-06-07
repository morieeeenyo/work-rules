import axios from 'axios'
import dayjs from 'dayjs'
import useSWR from 'swr'

import { getDateValue } from '@/app/utils/notion'

import type { WorkRuleAnswer } from '@/app/workrules/types'
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'

export const useRetrospectives = () => {
  const { data, isLoading } = useSWR<WorkRuleAnswer[]>(
    '/api/workrules/retrospectives',
    async (url: string) => {
      const response = await axios.get<QueryDatabaseResponse>(url)
      const convertedResponse = await Promise.all(
        response.data.results.map(async (page) => {
          if (!('properties' in page)) return null
          const properties = page.properties as PageObjectResponse['properties']

          const createdAtProperty = properties['回答日時']

          const { start: createdAt } = getDateValue(createdAtProperty)

          return {
            id: page.id,
            createdAt: createdAt
              ? dayjs(createdAt).format('YYYY/MM/DD hh:mm')
              : undefined,
            AchievementRateCommon: 0,
            AchievementRateEngineer: 0,
            AchievementRateManagement: 0,
          }
        }),
      )

      return convertedResponse.filter(
        (page) => page !== null,
      ) as WorkRuleAnswer[]
    },
  )

  return {
    data: data ?? [],
    isLoading,
  }
}
