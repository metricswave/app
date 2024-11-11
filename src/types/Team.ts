import {User} from "./User";

export type TeamId = number

export type Team = {
    id: TeamId
    owner_id: number
    currency: 'eur' | 'usd'
    initiated: boolean
    domain: string
    subscription_status: boolean
    subscription_type: string
    subscription_plan_id: number
    owner: User
    users: User[]
    limits: {
        soft: boolean
        hard: boolean
    }
}

export type TeamInvite = {
    id: number
    email: string
    team_id: number
}
