import {expirableLocalStorage, THIRTY_SECONDS} from "../helpers/ExpirableLocalStorage"
import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {OauthService, UserService, UserServiceType} from "../types/UserService"

const SERVICES_KEY: string = "nw:user-services"
const SERVICES_REFRESH_KEY: string = "nw:user-service:refresh"

export function useUserServicesState() {
    const [userServices, setUserServices] = useState<UserService[]>(
        expirableLocalStorage.get(SERVICES_KEY, []),
    )
    const [isFresh, setIsFresh] = useState<boolean>(
        expirableLocalStorage.get(SERVICES_REFRESH_KEY, false),
    )

    useEffect((force: boolean = false) => {
        if (isFresh && !force) return

        fetchAuthApi<{ services: UserService[] }>("/users/services", {
            success: (data) => {
                const services = filterUserServices(data.data.services)
                setUserServices(services)
                setIsFresh(true)
                expirableLocalStorage.set(SERVICES_KEY, services)
                expirableLocalStorage.set(SERVICES_REFRESH_KEY, true, THIRTY_SECONDS)
            },
            error: (data) => setIsFresh(false),
            catcher: (data) => setIsFresh(false),
        })
    }, [isFresh])

    return {userServices, reloadUserServices: () => setIsFresh(false)}
}

const filterUserServices = (userServices: UserService[]) => {
    return userServices
        .filter((service) => {
            if (service.service_id === UserServiceType.Google) {
                const scopes = (service as OauthService).service_data["scope"] ?? []
                return scopes.includes("https://www.googleapis.com/auth/calendar.readonly")
                    && scopes.includes("https://www.googleapis.com/auth/calendar.events.readonly")
            }

            return true
        })
}
