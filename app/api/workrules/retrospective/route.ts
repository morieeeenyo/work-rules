import { notionClient } from '@/lib/notionClient'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { unselectedRowIds } = body
  try {
    const response = await notionClient.pages.create({
      parent: {
        database_id: process.env.NOTION_RETROSPECTIVE_DATABASE_ID ?? '',
      },
      properties: {
        名前: {
          title: [
            {
              text: {
                content: new Date().toLocaleDateString('ja-JP'),
              },
            },
          ],
        },
        回答日時: {
          date: {
            start: new Date().toISOString(),
          },
        },
        体現できなかったワークルール: {
          type: 'relation',
          relation: unselectedRowIds.map((id: string) => ({ id })),
        },
      },
    })
    // NOTE: queryのレスポンスはUnionになっているので必要な型のみにキャストしてしまう
    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json(err)
  }
}
