import {useEffect, useState} from "react"
import {expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"

const KEY = "nw:user-usage"
let loading = false

type UserUsage = {
    usage: number
}

export function useUserUsageState() {
    const [loadedUsage, setLoadedUsage] = useState<boolean>(false)
    const [userUsage, setUserUsage] = useState<UserUsage>(
        expirableLocalStorage.get<UserUsage>(KEY, {usage: 0}),
    )

    const loadUsage = () => {
        if (loading) return
        loading = true

        fetchAuthApi<UserUsage>(
            `/users/usage`,
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

    useEffect(loadUsage, [])

    return {
        userUsage,
        loadedUsage,
        loadUsage,
    }
}
