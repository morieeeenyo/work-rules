import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook'

export const slack = {
  sendMessage: async (message: IncomingWebhookSendArguments) => {
    const url = process.env.SLACK_WEBHOOK_URL
    if (!url) {
      throw 'SLACK_WEBHOOK_URL is not defined'
    }
    const webhook = new IncomingWebhook(url)
    await webhook.send(message)
  },
}
