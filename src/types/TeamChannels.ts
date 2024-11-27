export enum TeamChannelType {
    Telegram = 1,
    Stripe = 2,
}

type BaseTeamChannel = {
    id: number;
    team_id: number;
    created_at: string;
    updated_at: string;
};

export type TeamChannel = TelegramTeamChannel | StripeChannel;

export type TelegramTeamChannel = BaseTeamChannel & {
    channel_id: TeamChannelType.Telegram;
    data: {
        configuration: {
            channel_id: string;
            channel_name: string;
        };
    };
};

export type StripeChannel = BaseTeamChannel & {
    channel_id: TeamChannelType.Stripe;
    data: {
        configuration: {
            api_key: string;
            name: string;
        };
    };
};
