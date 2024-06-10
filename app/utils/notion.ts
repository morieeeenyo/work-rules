import { notionClient } from '@/lib/notionClient'

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export const getPageTitle = (
  property: PageObjectResponse['properties'][string],
) => {
  if (property.type !== 'title') return null
  if (!('title' in property)) return null

  return property.title[0].plain_text
}

export const getSelectedValue = (
  property: PageObjectResponse['properties'][string],
) => {
  if (property.type !== 'select') return null
  if (!('select' in property)) return null

  return property.select?.name
}

export const getDateValue = (
  property: PageObjectResponse['properties'][string],
) => {
  if (property.type !== 'date') return {}
  if (!('date' in property)) return {}

  const start = property.date?.start
  const end = property.date?.end

  return {
    start,
    end,
  }
}

export const getRelatedPage = async (
  property: PageObjectResponse['properties'][string],
) => {
  return property.type === 'relation'
    ? await Promise.all(
        property.relation.map(async (relationObject) => {
          const { id } = relationObject
          return await notionClient.pages.retrieve({
            page_id: id,
          })
        }),
      )
    : []
}
