import {useEffect, useState} from "react"
import {Tokens} from "../types/Token"
import {DAY_SECONDS} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {DeviceName} from "./DeviceName"

const AUTH_KEY: string = "nw:auth"

export const getTokens = () => localStorage.getItem(AUTH_KEY)
    ? JSON.parse(localStorage.getItem(AUTH_KEY) as string) as Tokens
    : null

export function useAuthState() {
    const [tokens, setTokens] = useState<Tokens | null>(getTokens())

    const set = (tokens: Tokens | null) => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(tokens))
        setTokens(tokens)
    }

    useEffect(() => {
        const nowSeconds = Math.floor(Date.now() / 1000)
        const lessThanTwelveHoursToExpire = tokens && tokens.token.expires_at - nowSeconds < DAY_SECONDS / 2

        if (!lessThanTwelveHoursToExpire) {
            return
        }

        fetchAuthApi<Tokens>("/refresh", {
            method: "POST",
            refreshToken: true,
            body: {
                device_name: DeviceName.name(),
            },
            success: (data) => {
                set(data.data)
            },
            error: () => {
                set(null)
            },
            catcher: (err) => {
                console.log(err)
                set(null)
            },
        })
    }, [tokens])

    return {isAuth: tokens !== null, tokens, setTokens: set}
}
