export enum TeamChannelType {
    Telegram = 1,
}

type BaseTeamChannel = {
    id: number
    team_id: number
    created_at: string
    updated_at: string
}

export type TeamChannel = TelegramTeamChannel

export type TelegramTeamChannel = BaseTeamChannel & {
    channel_id: TeamChannelType.Telegram
    data: {
        configuration: {
            channel_id: string
            channel_name: string
        }
    }
}
