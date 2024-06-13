import type {
  GetPageResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export interface WorkRule {
  id: string
  title: string
  category?: '共通' | 'エンジニア' | 'マネジメント'
}

export type WorkRuleAnswer = {
  id: string
  createdAt: string
  AchievementRateCommon: number
  AchievementRateEngineer: number
  AchievementRateManagement: number
}

export type WorkRuleAnswerDetail = WorkRuleAnswer & {
  unachievedRules: WorkRule[]
}

export type RelationPropertyWithDetail =
  PageObjectResponse['properties']['relation'] & {
    relation: GetPageResponse[]
  }

export type ActionPlan = {
  id: string
  targetWorkRule: string
  actionPlan: string
  retrospective: string
}
