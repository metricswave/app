export enum UserServiceType {
    GitHub = 1,
    Google = 2,
    Telegram = 3,
}

type BaseUserService = {
    id: number
    user_id: string
    reconectable: boolean
    created_at: string
    updated_at: string
}

export type UserService = OauthService | TelegramUserService

export type OauthService = BaseUserService & {
    service_id: UserServiceType.GitHub | UserServiceType.Google
    service_data: { [key: string]: string | string[] }
}

export type TelegramUserService = BaseUserService & {
    service_id: UserServiceType.Telegram
    service_data: {
        configuration: {
            channel_id: string
            channel_name: string
        }
    }
}
