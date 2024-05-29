import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook'
import { NextApiRequest, NextApiResponse } from 'next'

export const slack = {
  sendMessage: async (message: IncomingWebhookSendArguments) => {
    const url = process.env.SLACK_WEBHOOK_URL
    const webhook = new IncomingWebhook(url ?? '')
    await webhook.send(message)
  },
}
