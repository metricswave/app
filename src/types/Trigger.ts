import {LocationValue} from "../components/form/LocationFieldBox"
import {WeekDaysType} from "../components/form/WeekdayFieldBox"

export enum TriggerTypeId {
    Webhook = 1,
    OnTime = 2,
    WeatherSummary = 3,
    TimeToLeave = 4,
}

export type Trigger = OnTimeTrigger | WebhookTrigger | WeatherSummaryTrigger | TimeToLeaveTrigger

export type BaseTrigger = {
    id: string
    uuid: string
    emoji: string
    title: string
    content: string
    trigger_type_id: TriggerTypeId
    configuration: {
        fields: { [key: string]: string }
    }
    via: TriggerVia[]
}

export type OnTimeTrigger = BaseTrigger & {
    trigger_type_id: TriggerTypeId.OnTime
    configuration: {
        fields: {
            weekdays: WeekDaysType[],
            time: string,
        }
    }
}

export type WebhookTrigger = BaseTrigger & {
    trigger_type_id: TriggerTypeId.Webhook
    configuration: {
        fields: {
            parameters: Array<string>,
        }
    }
}

export type WeatherSummaryTrigger = BaseTrigger & {
    trigger_type_id: TriggerTypeId.WeatherSummary
    configuration: {
        fields: {
            weekdays: string[],
            time: string,
            location: LocationValue,
        }
    }
}

export type TimeToLeaveTrigger = BaseTrigger & {
    trigger_type_id: TriggerTypeId.TimeToLeave,
    configuration: {
        fields: {
            origin: string,
            destination: string,
            mode: "driving" | "walking" | "bicycling" | "transit",
            arrival_time: string,
            weekdays: WeekDaysType[],
        }
    }
}

export type TriggerVia = {
    value: string
    label: string
    checked: boolean
    type: string
}
