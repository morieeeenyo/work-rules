import { getRelatedPage } from '@/app/utils/notion'

import type { GetPageResponse } from '@notionhq/client/build/src/api-endpoints'

// NOTE: Notion APIではrelation取得時にrelation先のプロパティまでは取得できない
// そのためrelation先のpage情報を一括で取得できる関数を作った
// relationプロパティが複数生えてくるケースは今んところないので、一つだけpropertyNameを渡すようにしている
export const generateResponseWithRelatedPage = async (
  response: GetPageResponse,
  propertyName: string,
) => {
  if (!('properties' in response)) return response
  const unachievedRulesProperty = response.properties[propertyName]
  if (!unachievedRulesProperty) return response
  if (unachievedRulesProperty.type !== 'relation') return response
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
