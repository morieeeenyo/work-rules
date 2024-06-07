import { NextResponse } from 'next/server'

import { notionClient } from '@/lib/notionClient'

import type { GetPageResponse } from '@notionhq/client/build/src/api-endpoints'

export const convertResponse = async (response: GetPageResponse) => {
  if (!('properties' in response)) return response
  const unachievedRulesProperty =
    response.properties['体現できなかったワークルール']
  const unachievedRules =
    unachievedRulesProperty.type === 'relation'
      ? await Promise.all(
          unachievedRulesProperty.relation.map(async (relationObject) => {
            const { id } = relationObject
            return await notionClient.pages.retrieve({
              page_id: id,
            })
          }),
        )
      : []

  return {
    ...response,
    properties: {
      ...response.properties,
      体現できなかったワークルール: {
        type: 'relation',
        relation: unachievedRules,
      },
    },
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  try {
    const response = await notionClient.pages.retrieve({
      page_id: id,
    })

    const convertedResponse = await convertResponse(response)

    return NextResponse.json(convertedResponse)
  } catch (err) {
    return NextResponse.json(err)
  }
}
