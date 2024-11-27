import { useEffect, useState } from "react";
import { Channel } from "../types/Channel";
import { expirableLocalStorage, FIFTEEN_MINUTES_SECONDS } from "../helpers/ExpirableLocalStorage";
import { fetchAuthApi } from "../helpers/ApiFetcher";

const CHANNELS_KEY: string = "nw:channels";

export function useChannelsState() {
    const [channels, setChannels] = useState<Channel[]>(expirableLocalStorage.get(CHANNELS_KEY, [], true));

    useEffect(() => {
        fetchAuthApi<Channel[]>(`/channels`, {
            success: (data) => {
                setChannels(data.data);
                expirableLocalStorage.set(CHANNELS_KEY, data.data, FIFTEEN_MINUTES_SECONDS);
            },
            error: (error) => null,
            catcher: (error) => null,
        });
    }, []);

    return {
        channels,
    };
}
