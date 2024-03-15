import {useEffect, useState} from "react"
import {expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {useAuthContext} from "../contexts/AuthContext";

const KEY = "nw:user-usage"
let loading = false

type UserUsage = {
    usage: number
}

export function useUserUsageState() {
    const currentTeamId = useAuthContext().teamState.currentTeamId
    const [loadedUsage, setLoadedUsage] = useState<boolean>(false)
    const [userUsage, setUserUsage] = useState<UserUsage>(
        expirableLocalStorage.get<UserUsage>(KEY, {usage: 0}),
    )

    const loadUsage = () => {
        if (loading) return

        if (currentTeamId === null) {
            setLoadedUsage(true)
            return
        }

        loading = true

        fetchAuthApi<UserUsage>(
            `/teams/${currentTeamId}/usage`,
            {
                success: (data) => {
                    setUserUsage(data.data)
                    setLoadedUsage(true)
                    expirableLocalStorage.set(KEY, data.data)
                    loading = false
                },
                error: (err: any) => loading = false,
                catcher: (err: any) => loading = false,
            },
        )
    }

    useEffect(loadUsage, [currentTeamId])

    return {
        userUsage,
        loadedUsage,
        loadUsage,
    }
}
