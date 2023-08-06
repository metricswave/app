import {LocationValue} from "../components/form/LocationFieldBox"
import {WeekDaysType} from "../components/form/WeekdayFieldBox"
import {WebhookTriggerType} from "./TriggerType"

export enum TriggerTypeId {
    Webhook = 1,
    OnTime = 2,
    WeatherSummary = 3,
    TimeToLeave = 4,
    CalendarTimeToLeave = 5,
}

export type Trigger =
    OnTimeTrigger
    | WebhookTrigger
    | WeatherSummaryTrigger
    | TimeToLeaveTrigger
    | CalendarTimeToLeaveTrigger

export type BaseTrigger = {
    id: number
    uuid: string
    emoji: string
    title: string
    content: string
    trigger_type_id: TriggerTypeId
    configuration: {
        type: WebhookTriggerType,
        fields: { [key: string]: string },
        steps?: string[],
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

export type CalendarTimeToLeaveTrigger = BaseTrigger & {
    trigger_type_id: TriggerTypeId.CalendarTimeToLeave,
    configuration: {
        fields: {
            origin: string,
            mode: "driving" | "walking" | "bicycling" | "transit",
        }
    }
}

export type TriggerVia = {
    id: number,
    label: string
    checked: boolean
    type: string
}
