import dayjs from 'dayjs'
import { NextResponse } from 'next/server'

import { notionClient } from '@/lib/notionClient'

export type SetActionPlanParams = {
  actionPlan: string
  selectedWorkRuleId: string
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json()
  const { actionPlan, selectedWorkRuleId }: SetActionPlanParams = body
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
              id: selectedWorkRuleId,
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
