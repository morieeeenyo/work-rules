import { NextResponse } from 'next/server'

import { notionClient } from '@/lib/notionClient'

import { generateResponseWithRelatedPage } from '../../_utils/notion'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  try {
    const response = await notionClient.pages.retrieve({
      page_id: id,
    })

    const responseWithRelatedWorkRulePage =
      await generateResponseWithRelatedPage(
        response,
        '体現できなかったワークルール',
      )

    return NextResponse.json(responseWithRelatedWorkRulePage)
  } catch (err) {
    return NextResponse.json(err)
  }
}
