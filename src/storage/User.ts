import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {User} from "../types/User"
import {DAY_SECONDS, expirableLocalStorage} from "../helpers/ExpirableLocalStorage"

const USER_REFRESH_KEY: string = "nw:user:refresh:v2"
const USER_KEY: string = "nw:user"

export const getUser = (): User | null => {
    return expirableLocalStorage.get(USER_KEY, false)
}

export function useUserState(isAuth: boolean) {
    const [expired, setExpired] = useState(false)

    const [isFreshUser, setIsFreshUser] = useState<true | false>(
        expirableLocalStorage.get(USER_REFRESH_KEY, false),
    )

    const [user, setUser] = useState<User | null>(getUser())

    const refreshUser = () => {
        fetchAuthApi<User>("/users", {
            success: (data) => {
                expirableLocalStorage.set(USER_REFRESH_KEY, true, DAY_SECONDS)
                expirableLocalStorage.set(USER_KEY, data.data)
                setUser(data.data)
                setExpired(false)
            },
            error: (data) => setExpired(true),
            catcher: (err) => setExpired(true),
        })
    }

    useEffect(() => {
        if (user !== null && isFreshUser) {
            return
        }

        refreshUser()
    }, [isAuth])

    return {user, setUser, refreshUser, expired, setExpired}
}
