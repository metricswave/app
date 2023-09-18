export type TeamId = number

export type Team = {
    id: TeamId
    domain: string
    subscription_status: boolean
    subscription_type: string
    subscription_plan_id: number
}
