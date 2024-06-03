import { NextResponse } from 'next/server'

import { notionClient } from '@/lib/notionClient'
import { slack } from '@/lib/slack'

import type { WorkRule } from '@/app/workrules/types'

export async function GET() {
  try {
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_RETROSPECTIVE_DATABASE_ID ?? '',
    })

    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json(err)
  }
}

const generateSlackMessage = (unselectedRows: WorkRule[]) => {
  const header = {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':white_check_mark: ワークルールの振り返りが完了しました！',
      emoji: true,
    },
  }
  const context = {
    type: 'context',
    elements: [
      {
        type: 'plain_text',
        text: '引き続き頑張っていきましょう！',
        emoji: true,
      },
    ],
  }
  const unachievedRules = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '体現できなかったワークルールは以下の通りです :point_down:',
      },
    },
    {
      type: 'rich_text',
      elements: [
        {
          type: 'rich_text_list',
          style: 'bullet',
          elements: unselectedRows.map((row: WorkRule) => ({
            type: 'rich_text_section',
            elements: [
              {
                type: 'text',
                text: `${row.title}`,
              },
            ],
          })),
        },
      ],
    },
  ]
  // TODO: ボタンのリンク先を変更する
  const actionsButtons = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '回答内容を確認するにはこちらをクリック :arrow_right:',
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '確認する',
          emoji: true,
        },
        value: 'click_me_123',
        url: 'https://google.com',
        action_id: 'button-action',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '体現度向上のためにアクションプランを設定しましょう :muscle:',
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '設定する',
          emoji: true,
        },
        value: 'click_me_123',
        url: 'https://google.com',
        action_id: 'button-action',
        style: 'primary',
      },
    },
  ]
  return {
    blocks: [header, context, ...unachievedRules, ...actionsButtons],
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { unselectedRows }: { unselectedRows: WorkRule[] } = body
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
          relation: unselectedRows.map((row: WorkRule) => ({ id: row.id })),
        },
      },
    })
    const message = generateSlackMessage(unselectedRows)
    await slack.sendMessage(message)
    return NextResponse.json(response)
  } catch (err) {
    throw NextResponse.json(err)
  }
}
