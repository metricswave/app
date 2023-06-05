import {useEffect, useState} from "react"
import {expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"

const KEY = "nw:user-usage"

type UserUsage = {
    usage: number
}

export function useUserUsageState() {
    const [userUsage, setUserUsage] = useState<UserUsage>(
        expirableLocalStorage.get<UserUsage>(KEY, {usage: 0}),
    )

    useEffect(() => {
        fetchAuthApi<UserUsage>(
            `/users/usage`,
            {
                success: (data) => {
                    setUserUsage(data.data)
                    expirableLocalStorage.set(KEY, data.data)
                },
                error: (err: any) => null,
                catcher: (err: any) => null,
            },
        )
    }, [])

    return {userUsage}
}
