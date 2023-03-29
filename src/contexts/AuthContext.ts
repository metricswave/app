import React from "react"
import {User} from "../types/User"
import {Tokens} from "../types/Token"

type AuthContextType = {
    user: User | null
    setUser: (user: User | null) => void
    tokens: Tokens | null,
    setTokens: (token: Tokens | null) => void
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    setUser: (user: User | null) => {
    },
    tokens: null,
    setTokens: (token: Tokens | null) => {
    },
})
