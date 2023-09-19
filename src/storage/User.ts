import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {User} from "../types/User"
import {DAY_SECONDS, expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {Team, TeamId} from "../types/Team";

const USER_REFRESH_KEY: string = "nw:user:refresh:v2"
const USER_KEY: string = "nw:user"
let loading: boolean = false

export const getUser = (): User | null => {
    return expirableLocalStorage.get(USER_KEY, null)
}

export type UserState = {
    user: User | null
    setUser: (user: User | null) => void
    setIsAuth: (isAuth: boolean) => void
    refreshUser: () => void
    expired: boolean
    setExpired: (expired: boolean) => void
    currentTeam: (id: TeamId) => Team | undefined
}

export function useUserState(): UserState {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(getUser())
    const [expired, setExpired] = useState(false)
    const [isFreshUser, setIsFreshUser] = useState<true | false>(
        expirableLocalStorage.get(USER_REFRESH_KEY, false),
    )

    const refreshUser = () => {
        if (loading) return
        loading = true

        fetchAuthApi<User>("/users", {
            success: (data) => {
                expirableLocalStorage.set(USER_REFRESH_KEY, true, DAY_SECONDS)
                expirableLocalStorage.set(USER_KEY, data.data)
                setUser(data.data)
                setExpired(false)
                loading = false
            },
            error: (data) => {
                setExpired(true)
                loading = false
            },
            catcher: (err) => {
                setExpired(true)
                loading = false
            },
        })
    }

    useEffect(() => {
        if (user !== null && isFreshUser) return
        refreshUser()
    }, [isAuth])

    return {
        user,
        setUser,
        setIsAuth,
        refreshUser,
        expired,
        setExpired,
        currentTeam: (id: TeamId): Team | undefined => {
            if (user === null) return undefined
            return user.all_teams.find(t => t.id === id)
        }
    }
}
