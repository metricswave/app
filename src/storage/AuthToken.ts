import {useState} from "react"
import {Tokens} from "../types/Token"

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

    return {isAuth: tokens !== null, tokens, setTokens: set}
}
