import { notionClient } from '@/lib/notionClient'

import type {
  GetPagePropertyResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

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

export const getRelationPageProperty = async (
  relationProperty: PageObjectResponse['properties'][string],
  targetPropertyId: string,
) => {
  if (relationProperty.type !== 'relation') return null
  if (!('relation' in relationProperty)) return null

  return await Promise.all(
    relationProperty.relation.map(async (relation) => {
      const page = await notionClient.pages.properties.retrieve({
        page_id: relation.id,
        property_id: targetPropertyId,
      })
      return {
        ...relation,
        page,
      }
    }),
  )
}

export type RelationPropertyWithPage = {
  type: 'relation'
  relation: Array<{
    id: string
    page: GetPagePropertyResponse
  }>
  id: string
}
