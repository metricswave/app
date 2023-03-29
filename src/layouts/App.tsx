import React from "react"
import {Navigate, Outlet, useLocation} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import {User} from "../types/User"
import {Tokens} from "../types/Token"

export default function App() {
    const location = useLocation()
    const [user, setUser] = React.useState<User | null>(null)
    const [tokens, setTokens] = React.useState<Tokens | null>(null)

    if (!user && location.pathname !== "/auth/signup") {
        return <Navigate to="/auth/signup"/>
    }

    return (
            <AuthContext.Provider value={{user, setUser, tokens, setTokens}}>
                <div className="App">
                    <header className="App-header">
                        NotifyWave 🌊
                    </header>

                    <Outlet/>
                </div>
            </AuthContext.Provider>
    )
}
