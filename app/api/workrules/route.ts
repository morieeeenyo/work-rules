import { NextResponse } from 'next/server'
import { notionClient } from '@/lib/notionClient'

export async function GET() {
  try {
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_WORKRULES_DATABASE_ID ?? '',
      sorts: [
        {
          property: '種別',
          direction: 'ascending',
        },
        {
          property: 'ID',
          direction: 'ascending',
        },
      ],
    })

    // NOTE: queryのレスポンスはUnionになっているので必要な型のみにキャストしてしまう
    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json(err)
  }
}
