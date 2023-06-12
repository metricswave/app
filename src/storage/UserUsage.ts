import {useEffect, useState} from "react"
import {expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"

const KEY = "nw:user-usage"

type UserUsage = {
    usage: number
}

export function useUserUsageState() {
    const [loadedUsage, setLoadedUsage] = useState<boolean>(false)
    const [userUsage, setUserUsage] = useState<UserUsage>(
        expirableLocalStorage.get<UserUsage>(KEY, {usage: 0}),
    )

    const loadUsage = () => {
        fetchAuthApi<UserUsage>(
            `/users/usage`,
            {
                success: (data) => {
                    setUserUsage(data.data)
                    setLoadedUsage(true)
                    expirableLocalStorage.set(KEY, data.data)
                },
                error: (err: any) => null,
                catcher: (err: any) => null,
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
