'use client'

import axios from 'axios'
import useSWR from 'swr'

import { getPageTitle, getSelectedValue } from '@/app/utils/notion'

import type { WorkRule } from '@/app/workrules/types'
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'

export const useWorkRules = () => {
  const { data, isLoading } = useSWR<WorkRule[]>(
    '/api/workrules',
    async (url: string) => {
      const response = await axios.get<QueryDatabaseResponse>(url)

      const convertedResponse = response.data.results.map((page) => {
        if (!('properties' in page)) return null
        const properties = page.properties as PageObjectResponse['properties']

        const titlePropery = properties['ルール']
        const categoryPropery = properties['種別']

        const title = getPageTitle(titlePropery)
        const category = getSelectedValue(categoryPropery)

        return {
          id: page.id,
          title: title ?? '',
          category: category as WorkRule['category'],
        }
      })

      return convertedResponse.filter((page) => page !== null) as WorkRule[]
    },
  )

  return {
    data: data ?? [],
    isLoading,
  }
}
