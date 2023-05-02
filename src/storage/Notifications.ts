import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage"
import {Notification} from "../types/Notification"

const NOTIFICATIONS_KEY: string = "nw:notifications"
const NOTIFICATIONS_REFRESH_KEY: string = "nw:notifications:refresh"

export function useNotificationsStage() {
    const [isFresh, setIsFresh] = useState<true | false>(
        expirableLocalStorage.get(NOTIFICATIONS_REFRESH_KEY, false),
    )
    const [notifications, setNotifications] = useState<Notification[]>(
        expirableLocalStorage.get(NOTIFICATIONS_KEY, []),
    )

    const reloadNotifications = () => {
        if (notifications.length > 0 && isFresh) {
            return
        }

        fetchAuthApi<Notification[]>("/notifications", {
            success: (data) => {
                const t = data.data
                expirableLocalStorage.set(NOTIFICATIONS_REFRESH_KEY, true, FIVE_SECONDS)
                expirableLocalStorage.set(NOTIFICATIONS_KEY, t)
                setNotifications(t)
                setIsFresh(true)
            },
            error: (data) => setIsFresh(false),
            catcher: (err) => setIsFresh(false),
        })
    }

    useEffect(() => {
        reloadNotifications()
    }, [isFresh])

    useEffect(() => {
        const interval = setInterval(reloadNotifications, FIVE_SECONDS * 1000)
        return () => clearInterval(interval)
    }, [])

    return {
        notifications,
        refreshNotifications: () => setIsFresh(false),
    }
}
