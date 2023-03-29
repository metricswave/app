import React from "react"
import {User} from "../types/User"

type AuthContextType = {
    user: User | null
    setUser: (user: User | null) => void
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    setUser: () => {
    },
})
