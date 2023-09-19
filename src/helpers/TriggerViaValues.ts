import {Trigger, TriggerVia} from "../types/Trigger"
import {TeamChannel, TeamChannelType, TelegramTeamChannel} from "../types/TeamChannels";

export const mergeDefaultWithTriggerViaValues = (teamChannels: TeamChannel[], trigger: Trigger | undefined) => {
    const telegramChannelsVia = teamChannels
        .filter((c) => c.channel_id === TeamChannelType.Telegram)
        .map((c) => {
            return ({
                id: (c as TelegramTeamChannel).id,
                label: `Telegram: ${(c as TelegramTeamChannel).data.configuration.channel_name}`,
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

    return array.filter(onlyUnique).filter((value) => value.id !== 0)
}
