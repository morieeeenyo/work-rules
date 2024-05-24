export interface WorkRule {
  id: string
  title: string
}

// titleがEmptyObject型で、中身を取り出せなかったため独自で型定義
export type TitleProperty = {
  type: string
  text: {
    content: string
    link: {
      url: string
    }
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: 'default'
  }
  plain_text: string
  href: string
}
