'use client'
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
  SelectPropertyItemObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import axios from 'axios'
import { NextResponse } from 'next/server'
import useSWR from 'swr'
import { WorkRule } from './type'
import { getPageTitle, getSelectedValue } from '@/app/utils/notion'

export const useWorkRules = () => {
  const { data, isLoading } = useSWR<WorkRule[]>(
    '/api/workrules',
    async (url: string) => {
      const response = await axios.get<QueryDatabaseResponse>(url)

      const convertedResponse = response.data.results.map((page) => {
        if (!('properties' in page)) return null
        const properties = page.properties as PageObjectResponse['properties']

        const titlePropery = properties['ルール']
        const typePropery = properties['種別']

        const title = getPageTitle(titlePropery)
        const type = getSelectedValue(typePropery)

        return {
          id: page.id,
          title: title ?? '',
          type: type as WorkRule['type'],
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
