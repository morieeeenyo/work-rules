import dayjs from 'dayjs'
import { NextResponse } from 'next/server'

import { notionClient } from '@/lib/notionClient'

import { generateResponseWithRelatedPage } from '../../../_utils/notion'

import type { WorkRule } from '@/app/workrules/types'

// NOTE: actionPlan - retrospectiveの関係は1対1なので、actionPlanのidを指定せずretrospectiveのidから参照させる
// 結果としてpages.retrieveではなくdatabases.queryを使うことになった
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

    // NOTE: 一つの振り返りに対して一つしかアクションプランは設定させないので、0番目をレスポンスとして扱う
    // 型ガード的にこのif文は必要
    if (response.results[0].object !== 'page')
      throw new Error('Unexpected response object type')

    const convertedResponse = await generateResponseWithRelatedPage(
      response.results[0],
      '今週達成するワークルール',
    )

    return NextResponse.json(convertedResponse)
  } catch (err) {
    return NextResponse.json(err)
  }
}

export type SetActionPlanParams = {
  actionPlan: string
  targetWorkRule: WorkRule
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json()
  const { actionPlan, targetWorkRule }: SetActionPlanParams = body
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
              id: targetWorkRule.id,
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
