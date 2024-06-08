import axios from 'axios'
import dayjs from 'dayjs'
import useSWR from 'swr'

import {
  getDateValue,
  getPageTitle,
  getSelectedValue,
} from '@/app/utils/notion'

import type {
  RelationPropertyWithDetail,
  WorkRule,
  WorkRuleAnswerDetail,
} from '../types'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

type Args = {
  retrospectiveId: string
}

export const useRetrospective = ({ retrospectiveId }: Args) => {
  const { data, isLoading } = useSWR<WorkRuleAnswerDetail>(
    `/api/workrules/retrospectives/${retrospectiveId}`,
    async (url: string) => {
      const response = await axios.get<PageObjectResponse>(url)

      const properties = response.data.properties

      const { start: createdAt } = getDateValue(properties['回答日時'])

      if (!createdAt) throw new Error('回答日時が取得できませんでした')

      const unachievedRulesProperty = properties['体現できなかったワークルール']

      const unachievedRules = (
        unachievedRulesProperty as RelationPropertyWithDetail
      ).relation
        .map((page) => {
          if (!('properties' in page)) return null
          return {
            id: page.id,
            title: getPageTitle(page.properties['ルール']),
            category: getSelectedValue(
              page.properties['種別'],
            ) as WorkRule['category'],
          }
        })
        .filter((page) => page !== null) as WorkRule[]

      return {
        id: response.data.id,
        createdAt: dayjs(createdAt).format('YYYY/MM/DD hh:mm'),
        AchievementRateCommon: 0,
        AchievementRateEngineer: 0,
        AchievementRateManagement: 0,
        unachievedRules: unachievedRules,
      }
    },
  )

  return {
    data: data,
    isLoading,
  }
}
