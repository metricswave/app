import React from "react"
import {User} from "../types/User"

type AuthContextType = {
    user: User | null
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
})
