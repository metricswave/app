import { useEffect, useRef, useState } from "react";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import { expirableLocalStorage } from "../helpers/ExpirableLocalStorage";
import { Notification } from "../types/Notification";
import { useAuthContext } from "../contexts/AuthContext";

export function useNotificationsStage() {
    const { currentTeamId } = useAuthContext().teamState;
    const [idFilter, setIdFilter] = useState<string>("");
    const NOTIFICATIONS_KEY = `nw:${currentTeamId}:notifications:${idFilter}`;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [lastPageFetched, setLastPageFetched] = useState<number>(0);
    const [lastPageAvailable, setLastPageAvailable] = useState<number>(0);

    const loadNotifications = async (page: number = 1) => {
        setFetching(true);

        let query = "?page=" + page;

        if (idFilter) {
            query = query + "&user_parameter=" + idFilter;
        }

        await fetchAuthApi<Notification[]>(`/teams/${currentTeamId}/notifications${query}`, {
            success: (data) => {
                if (data.current_page && data.current_page > lastPageFetched) {
                    setLastPageFetched(data.current_page);
                }

                if (data.last_page && data.last_page > lastPageAvailable) {
                    setLastPageAvailable(data.last_page);
                }

                const t = data.data;
                expirableLocalStorage.set(NOTIFICATIONS_KEY, t);
                setFetched(true);
                mergeNotificatons(t, data.current_page === 1);
                setFetching(false);
            },
        });
    };

    const loadFromCache = () => {
        const cached = expirableLocalStorage.get(NOTIFICATIONS_KEY, false);
        if (cached !== false) {
            setNotifications(cached);
        }
    };

    const mergeNotificatons = (notifications: Notification[], before: boolean) => {
        setNotifications((currentNotifications) => {
            const currentNotificationIds = new Set(currentNotifications.map((notification) => notification.id));
            const newNotifications = notifications.filter(
                (notification) => !currentNotificationIds.has(notification.id),
            );

            if (before) {
                return [...newNotifications, ...currentNotifications];
            }

            return [...currentNotifications, ...newNotifications];
        });
    };

    useEffect(() => {
        if (idFilter === "") return;

        loadFromCache();
        loadNotifications();
    }, [idFilter]);

    return {
        notifications,
        load: (filter: string) => {
            setIdFilter(filter);
        },
        loadPage: (page?: number | undefined) => {
            loadNotifications(page ?? lastPageFetched + 1);
        },
        filter: idFilter,
        fetching,
        fetched,
        thereIsMore: lastPageFetched < lastPageAvailable,
    };
}

function usePollingEffect(asyncCallback: () => void, dependencies: string[] = [], shouldRun: boolean) {
    const interval = 5000;
    const timeoutIdRef = useRef<string | number | undefined | NodeJS.Timeout>(undefined);
    useEffect(() => {
        let _stopped = false;
        // Side note: preceding semicolon needed for IIFEs.
        (async function pollingCallback() {
            try {
                if (shouldRun) await asyncCallback();
            } finally {
                // Set timeout after it finished, unless stopped
                timeoutIdRef.current = !_stopped && setTimeout(pollingCallback, interval);
            }
        })();
        // Clean up if dependencies change
        return () => {
            _stopped = true; // prevent racing conditions
            clearTimeout(timeoutIdRef.current);
        };
    }, [...dependencies, interval]);
}
