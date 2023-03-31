import {DAY_SECONDS, expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {UserService} from "../types/UserService"

const SERVICES_KEY: string = "nw:user-services"
const SERVICES_REFRESH_KEY: string = "nw:user-service:refresh"

export function useUserServicesState() {
    const [userServices, setUserServices] = useState<UserService[]>(
        expirableLocalStorage.get(SERVICES_KEY, []),
    )
    const [isFresh, setIsFresh] = useState<boolean>(
        expirableLocalStorage.get(SERVICES_REFRESH_KEY, false),
    )

    const loadUserServices = (force: boolean = false) => {
        if (isFresh && !force) return

        fetchAuthApi<{ services: UserService[] }>("/users/services", {
            success: (data) => {
                setUserServices(data.data.services)
                setIsFresh(true)
                expirableLocalStorage.set(SERVICES_KEY, data.data.services)
                expirableLocalStorage.set(SERVICES_REFRESH_KEY, true, DAY_SECONDS)
            },
            error: (data) => setIsFresh(false),
            catcher: (data) => setIsFresh(false),
        })
    }

    useEffect(loadUserServices, [])

    return {userServices, loadUserServices}
}
