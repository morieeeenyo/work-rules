import { notionClient } from '@/lib/notionClient'
import { slack } from '@/lib/slack'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

const generateSlackMessage = (message: string) => {
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
          elements: [
            {
              type: 'rich_text_section',
              elements: [
                {
                  type: 'text',
                  text: 'item 1: ',
                },
                {
                  type: 'emoji',
                  name: 'basketball',
                },
              ],
            },
          ],
        },
      ],
    },
  ]
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
      },
    },
  ]
  return {
    blocks: [header, context, ...unachievedRules, ...actionsButtons],
  }
}

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
    const message = generateSlackMessage('hogefuga')
    await slack.sendMessage(message)
    return NextResponse.json(response)
  } catch (err) {
    throw NextResponse.json(err)
  }
}
