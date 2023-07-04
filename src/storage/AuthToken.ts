import {useEffect, useState} from "react"
import {Tokens} from "../types/Token"
import {DAY_SECONDS, FIFTEEN_MINUTES_SECONDS} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {DeviceName} from "./DeviceName"
import {useNavigate} from "react-router-dom"

const AUTH_KEY: string = "nw:auth"
const REFRESH_INTERVAL = FIFTEEN_MINUTES_SECONDS

export const getTokens = () => localStorage.getItem(AUTH_KEY)
    ? JSON.parse(localStorage.getItem(AUTH_KEY) as string) as Tokens
    : null

export function useAuthState() {
    const navigate = useNavigate()
    const [tokens, setTokens] = useState<Tokens | null>(getTokens())

    const set = (tokens: Tokens | null) => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(tokens))
        setTokens(tokens)
    }

    const impersonate = (id: number) => {
        fetchAuthApi<Tokens>(
            `/auth/impersonate/`,
            {
                method: "POST",
                body: {
                    user_id: id,
                    device_name: DeviceName.name(),
                },
                success: (data) => {
                    localStorage.clear()
                    set(data.data)
                    navigate("/")
                },
                error: () => null,
                catcher: () => null,
            },
        )
    }

    const logout = () => {
        fetchAuthApi("/logout", {
            method: "POST",
            body: {device_name: DeviceName.name()},
            success: () => null,
            error: () => null,
            catcher: () => null,
        })
        localStorage.clear()
        set(null)
        navigate("/auth/login")
    }

    const refreshTokenIfNeeded = () => {
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
                set(null)
            },
        })
    }

    useEffect(refreshTokenIfNeeded, [tokens])

    useEffect(() => {
        const interval = setInterval(refreshTokenIfNeeded, REFRESH_INTERVAL)
        return () => clearInterval(interval)
    }, [tokens])

    return {isAuth: tokens !== null, tokens, setTokens: set, logout, impersonate}
}
