export interface PromotionCondition {
  conditionType: string
  operator: string
  value: string
}

export interface PromotionAction {
  actionType: string
  value: number
  maxDiscount?: number
  discountType?: string
}

export interface Promotion {
  id: number
  name: string
  description: string
  couponCode?: string
  type: string
  active: boolean
  stackable: boolean
  priority: number
  usageLimit?: number
  startDate: string
  endDate: string
  conditions: PromotionCondition[]
  action: PromotionAction
  promotionGroup?: string
}