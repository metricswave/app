import {useState} from "react"
import {Tokens} from "../types/Token"

const AUTH_KEY: string = "nw:auth"

export const getTokens = () => localStorage.getItem(AUTH_KEY)
    ? JSON.parse(localStorage.getItem(AUTH_KEY) as string) as Tokens
    : null

export function useAuthState() {
    const [tokens] = useState<Tokens | null>(getTokens())

    // todo: Refresh token if is about to expire

    return {isAuth: tokens !== null, tokens}
}
