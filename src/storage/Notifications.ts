import { useEffect, useState } from "react";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import { expirableLocalStorage, FIFTEEN_MINUTES_SECONDS, FIVE_SECONDS } from "../helpers/ExpirableLocalStorage";
import { Notification } from "../types/Notification";
import { useAuthContext } from "../contexts/AuthContext";

export function useNotificationsStage() {
    const { currentTeamId } = useAuthContext().teamState;
    const [idFilter, setIdFilter] = useState<string>("");
    const NOTIFICATIONS_KEY = (userIdFilter: string) => `nw:${currentTeamId}:notifications:${userIdFilter}`;
    const [notifications, setNotifications] = useState<Notification[]>(
        expirableLocalStorage.get(NOTIFICATIONS_KEY(""), [], true),
    );
    const intervalTime = idFilter === "" ? FIFTEEN_MINUTES_SECONDS * 1000 : FIVE_SECONDS * 1000 * 2;

    const reloadNotifications = (userIdFilter: string, force = false) => {
        setIdFilter(userIdFilter);

        const cached = expirableLocalStorage.get(NOTIFICATIONS_KEY(userIdFilter), false);
        if (cached !== false && notifications.length > 0 && !force) {
            setNotifications(cached);
            return;
        }

        let query = "";
        if (userIdFilter) {
            query = "?user_parameter=" + userIdFilter;
        }

        fetchAuthApi<Notification[]>(`/teams/${currentTeamId}/notifications${query}`, {
            success: (data) => {
                const t = data.data;
                expirableLocalStorage.set(NOTIFICATIONS_KEY(userIdFilter), t);
                setNotifications(t);
            },
        });
    };

    useEffect(() => reloadNotifications(idFilter, true), [idFilter]);

    useEffect(() => {
        const interval = setInterval(() => reloadNotifications(idFilter, true), intervalTime);
        return () => clearInterval(interval);
    }, [idFilter]);

    return {
        notifications,
        setIdFilter,
        refreshNotifications: (idFilter: string) => reloadNotifications(idFilter, true),
    };
}
