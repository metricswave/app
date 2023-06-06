import {Trigger, TriggerVia} from "../types/Trigger"
import {TelegramUserService, UserService, UserServiceType} from "../types/UserService"

export const mergeDefaultWithTriggerViaValues = (userServices: UserService[], trigger: Trigger | undefined) => {
    const telegramChannelsVia = userServices
        .filter((service) => service.service_id === UserServiceType.Telegram)
        .map((service) => {
            return ({
                id: (service as TelegramUserService).id,
                label: `Telegram: ${(service as TelegramUserService).service_data.configuration.channel_name}`,
                checked: false,
                type: "telegram",
            })
        })

    return uniqueArrayValues([
        ...trigger && trigger.via !== null ? trigger.via : [],
        {id: 0, label: "Mail", checked: true, type: "mail"},
        ...telegramChannelsVia,
    ])
}

export const uniqueArrayValues = (array: TriggerVia[]): TriggerVia[] => {
    const onlyUnique = (value: TriggerVia, index: number, array: TriggerVia[]) => {
        return array.findIndex(i => i.id === value.id && i.type === value.type) === index
    }

    return array.filter(onlyUnique)
}
