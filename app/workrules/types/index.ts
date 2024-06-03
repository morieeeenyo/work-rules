export interface WorkRule {
  id: string
  title: string
  category?: '共通' | 'エンジニア' | 'マネジメント'
}

export interface WorkRuleAnswer {
  id: string
  createdAt: string
  AchievementRateCommon: number
  AchievementRateEngineer: number
  AchievementRateManagement: number
}
