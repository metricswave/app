import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage"
import {Notification} from "../types/Notification"
import {useAuthContext} from "../contexts/AuthContext";

export function useNotificationsStage() {
    const {currentTeamId} = useAuthContext().teamState
    const NOTIFICATIONS_KEY = () => `nw:${currentTeamId}:notifications`
    const [notifications, setNotifications] = useState<Notification[]>(
        expirableLocalStorage.get(NOTIFICATIONS_KEY(), [], true),
    )

    const reloadNotifications = (force = false) => {
        const cached = expirableLocalStorage.get(NOTIFICATIONS_KEY(), false)
        if (cached !== false && notifications.length > 0 && !force) {
            setNotifications(cached)
            return
        }

        fetchAuthApi<Notification[]>(`/teams/${currentTeamId}/notifications`, {
            success: (data) => {
                const t = data.data
                expirableLocalStorage.set(NOTIFICATIONS_KEY(), t)
                setNotifications(t)
            },
        })
    }

    useEffect(() => reloadNotifications(true), [currentTeamId])
    useEffect(() => {
        setNotifications(
            expirableLocalStorage.get(NOTIFICATIONS_KEY(), [], true),
        )
    }, [currentTeamId])

    useEffect(() => {
        const interval = setInterval(() => reloadNotifications(true), FIVE_SECONDS * 1000)
        return () => clearInterval(interval)
    }, [])

    return {
        notifications,
        refreshNotifications: () => reloadNotifications(true),
    }
}
