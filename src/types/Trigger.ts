export enum TriggerType {
    Webhook = 1,
    OnTime = 2,
}

export type Trigger = {
    id: string
    uuid: string
    emoji: string
    title: string
    content: string
    trigger_type_id: TriggerType.OnTime
    configuration: {
        fields: {
            weekdays: string[],
            time: string,
        }
    }
    via: TriggerVia[]
} | {
    id: string
    uuid: string
    emoji: string
    title: string
    content: string
    trigger_type_id: TriggerType.Webhook
    configuration: {
        fields: {
            parameters: Array<string>,
        }
    }
    via: TriggerVia[]
}

export type TriggerVia = {
    value: string
    label: string
    checked: boolean
    type: string
}
