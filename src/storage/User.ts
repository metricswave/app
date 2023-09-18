import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {User} from "../types/User"
import {DAY_SECONDS, expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {useTeamState} from "./Team";
import {Team} from "../types/Team";

const USER_REFRESH_KEY: string = "nw:user:refresh:v2"
const USER_KEY: string = "nw:user"
let loading: boolean = false

export const getUser = (): User | null => {
    return expirableLocalStorage.get(USER_KEY, null)
}

export function useUserState(isAuth: boolean) {
    const [user, setUser] = useState<User | null>(getUser())
    const {currentTeamId, setCurrentTeamId, setCurrentTeamFromTeams} = useTeamState()
    const [expired, setExpired] = useState(false)
    const [isFreshUser, setIsFreshUser] = useState<true | false>(
        expirableLocalStorage.get(USER_REFRESH_KEY, false),
    )

    if (currentTeamId === null && user !== null) {
        setCurrentTeamFromTeams(user.all_teams)
    }

    const refreshUser = () => {
        if (loading) return
        loading = true

        fetchAuthApi<User>("/users", {
            success: (data) => {
                expirableLocalStorage.set(USER_REFRESH_KEY, true, DAY_SECONDS)
                expirableLocalStorage.set(USER_KEY, data.data)
                setUser(data.data)
                setExpired(false)
                setCurrentTeamFromTeams(data.data.all_teams)
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
        refreshUser,
        expired,
        setExpired,
        currentTeam: (): Team | undefined => {
            if (user === null) return undefined
            return user.all_teams.find(t => t.id === currentTeamId)
        }
    }
}
