import { getRelatedPage } from '@/app/utils/notion'

import type { GetPageResponse } from '@notionhq/client/build/src/api-endpoints'

export const generateResponseWithRelatedPage = async (
  response: GetPageResponse,
  propertyName: string,
) => {
  if (!('properties' in response)) return response
  const unachievedRulesProperty = response.properties[propertyName]
  const unachievedRules = await getRelatedPage(unachievedRulesProperty)

  return {
    ...response,
    properties: {
      ...response.properties,
      [propertyName]: {
        type: 'relation',
        relation: unachievedRules,
      },
    },
  }
}
