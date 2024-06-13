import { NextResponse } from 'next/server'

import { notionClient } from '@/lib/notionClient'

export type CreateActionPlanRetrospectiveParams = {
  retrospective: string
}

export async function POST(
  request: Request,
  { params }: { params: { id: string; actionPlanId: string } },
) {
  const body = await request.json()
  const { retrospective }: CreateActionPlanRetrospectiveParams = body
  const { actionPlanId } = params

  try {
    const response = await notionClient.pages.update({
      page_id: actionPlanId,
      properties: {
        振り返り: {
          rich_text: [
            {
              text: {
                content: retrospective,
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
