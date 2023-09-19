import {useEffect, useState} from "react";
import {expirableLocalStorage, FIFTEEN_MINUTES_SECONDS} from "../helpers/ExpirableLocalStorage";
import {fetchAuthApi} from "../helpers/ApiFetcher";
import {useAuthContext} from "../contexts/AuthContext";
import {TeamChannel} from "../types/TeamChannels";

const TEAM_CHANNELS_KEY: string = "nw:team-channels"

export function useTeamChannelsState() {
    const {currentTeamId} = useAuthContext().teamState
    const [teamChannels, setTeamChannels] = useState<TeamChannel[]>(
        expirableLocalStorage.get(TEAM_CHANNELS_KEY, [], true),
    )

    const reloadTeamChannels = () => {
        fetchAuthApi<TeamChannel[]>(`/teams/${currentTeamId}/channels`, {
            success: (data) => {
                setTeamChannels(data.data)
                expirableLocalStorage.set(TEAM_CHANNELS_KEY, data.data, FIFTEEN_MINUTES_SECONDS)
            },
            error: (error) => null,
            catcher: (error) => null,
        })
    }

    useEffect(() => {
        const cached = expirableLocalStorage.get(TEAM_CHANNELS_KEY, false);
        if (cached) return

        reloadTeamChannels()
    }, []);

    return {
        teamChannels,
        reloadTeamChannels,
    }
}
