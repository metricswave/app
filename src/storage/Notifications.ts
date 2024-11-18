import { useEffect, useMemo, useState } from "react";
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
    const intervalTime = idFilter !== "" ? FIFTEEN_MINUTES_SECONDS * 1000 : FIVE_SECONDS * 1000;
    const [iterationCount, setIterationCount] = useState(0);
    const iterationCountLimit = 10;
    const intervalRunning = useMemo(() => {
        return iterationCount < iterationCountLimit;
    }, [iterationCount, iterationCountLimit]);

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

    const stopInterval = (interval: number | NodeJS.Timer) => {
        clearInterval(interval);
    };

    const startInterval = () => {
        setIterationCount(0);
    };

    useEffect(startInterval, [idFilter]);

    useEffect(() => {
        const interval = setInterval(() => {
            reloadNotifications(idFilter, true);

            setIterationCount((prevCount) => {
                if (prevCount + 1 >= iterationCountLimit) {
                    stopInterval(interval);
                }
                return prevCount + 1;
            });
        }, intervalTime);
        return () => stopInterval(interval);
    }, [idFilter, intervalTime, intervalRunning]);

    return {
        notifications,
        setIdFilter,
        startInterval,
        intervalRunning,
        refreshNotifications: (idFilter: string) => reloadNotifications(idFilter, true),
    };
}
