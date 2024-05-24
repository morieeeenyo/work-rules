'use client'
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'
import axios from 'axios'
import { NextResponse } from 'next/server'
import useSWR from 'swr'
import { TitleProperty, WorkRule } from './type'

export const useWorkRules = () => {
  const { data, isLoading } = useSWR<WorkRule[]>(
    '/api/workrules',
    async (url: string) => {
      const response = await axios.get<DatabaseObjectResponse[]>(url)

      return response.data.map((page) => {
        const properties = page.properties

        const titleProperyName =
          Object.keys(properties).find(
            (key) => properties[key].type === 'title',
          ) ?? ''

        const titlePropery = properties[titleProperyName]

        // TODO: Linkを取り出すにはもうちょい頑張る必要がある
        const title =
          titlePropery.type === 'title'
            ? (titlePropery.title as unknown as TitleProperty[])
                .map((text) => (text.type === 'text' ? text.text.content : ''))
                .join('')
            : ''

        return {
          id: page.id,
          title,
        }
      })
    },
  )

  return {
    data: data ?? [],
    isLoading,
  }
}
