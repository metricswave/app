import {TriggerTypeId} from "./Trigger"

export type WebhookTriggerType = "custom" | "visits" | "funnel" | "money_income"
export const AllWebhookTriggers: WebhookTriggerType[] = ["visits", "money_income", "funnel", "custom" ]

export type TriggerType = {
    id: TriggerTypeId
    name: string
    description: string
    icon: string
    configuration: {
        fields: Array<TriggerTypeField>
        version: string
    }
}

export type TriggerTypeField = {
    label: string
    name: string
    required: boolean
    multiple: boolean
    type: string
    default?: string
    options?: { label: string, value: string }[]
}
