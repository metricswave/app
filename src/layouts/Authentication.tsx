import React from "react"
import {Outlet} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import {User} from "../types/User"

export default function Authentication() {
    const [user, setUser] = React.useState<User | null>(null)

    return (
            <AuthContext.Provider value={{user, setUser}}>
                <Outlet/>
            </AuthContext.Provider>
    )
}
