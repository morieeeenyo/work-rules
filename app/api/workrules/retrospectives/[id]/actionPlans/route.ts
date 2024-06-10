import dayjs from 'dayjs'
import { NextResponse } from 'next/server'

import { getRelatedPage } from '@/app/utils/notion'
import { notionClient } from '@/lib/notionClient'

import type { WorkRule } from '@/app/workrules/types'
import type { GetPageResponse } from '@notionhq/client/build/src/api-endpoints'

const generateResponseWithRelatedWorkRulePage = async (
  response: GetPageResponse,
) => {
  if (!('properties' in response)) return response
  const unachievedRulesProperty =
    response.properties['今週達成するワークルール']
  const unachievedRules = await getRelatedPage(unachievedRulesProperty)

  return {
    ...response,
    properties: {
      ...response.properties,
      今週達成するワークルール: {
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
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_ACTION_PLANS_DATABASE_ID ?? '',
      filter: {
        property: 'ワークルール振り返り',
        relation: {
          contains: id,
        },
      },
    })

    if (response.results.length === 0)
      return NextResponse.json(response.results[0])

    // NOTE: 一つの振り返りに対して一つしかアクションプランは設定させないので、0番目に対してのみ判定する
    if (response.results[0].object !== 'page') throw new Error('Not a page')

    const convertedResponse = await generateResponseWithRelatedWorkRulePage(
      response.results[0],
    )

    return NextResponse.json(convertedResponse)
  } catch (err) {
    return NextResponse.json(err)
  }
}

export type SetActionPlanParams = {
  actionPlan: string
  selectedWorkRule: WorkRule
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json()
  const { actionPlan, selectedWorkRule }: SetActionPlanParams = body
  const { id: retrospectiveId } = params
  try {
    const response = await notionClient.pages.create({
      parent: {
        database_id: process.env.NOTION_ACTION_PLANS_DATABASE_ID ?? '',
      },
      properties: {
        回答日時: {
          title: [
            {
              text: {
                content: dayjs().format('YYYY/MM/DD HH:mm:ss'),
              },
            },
          ],
        },
        ワークルール振り返り: {
          relation: [
            {
              id: retrospectiveId,
            },
          ],
        },
        今週達成するワークルール: {
          relation: [
            {
              id: selectedWorkRule.id,
            },
          ],
        },
        アクションプラン: {
          rich_text: [
            {
              text: {
                content: actionPlan,
              },
            },
          ],
        },
      },
    })

    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json(err)
  }
}
