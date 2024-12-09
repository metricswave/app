import { useEffect, useState } from "react";
import { TeamInvite } from "../types/Team";
import { useAuthContext } from "../contexts/AuthContext";
import { expirableLocalStorage, THIRTY_SECONDS } from "../helpers/ExpirableLocalStorage";
import { fetchAuthApi } from "../helpers/ApiFetcher";

export function useTeamInvitesState() {
    const { currentTeamId } = useAuthContext().teamState;
    const CACHE_KEY = () => `nw:team:${currentTeamId}:invites`;
    const [invites, setInvites] = useState<TeamInvite[]>(
        expirableLocalStorage.get<TeamInvite[]>(CACHE_KEY(), [], true),
    );

    const loadInvites = (force = false) => {
        const cached = expirableLocalStorage.get(CACHE_KEY(), false);
        if (cached !== false && !force) {
            setInvites(cached);
            return;
        }

        fetchAuthApi<TeamInvite[]>(`/teams/${currentTeamId}/invites`, {
            success: (data) => {
                setInvites(data.data);
                expirableLocalStorage.set(CACHE_KEY(), data.data, THIRTY_SECONDS);
            },
        });
    };

    useEffect(loadInvites, [currentTeamId]);

    return {
        invites,
        loadInvites,
    };
}
