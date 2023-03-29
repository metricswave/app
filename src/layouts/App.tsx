import React from "react"
import {Navigate, Outlet, useLocation} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import {User} from "../types/User"

export default function App() {
    const location = useLocation()
    const [user, setUser] = React.useState<User | null>(null)

    if (!user && location.pathname !== "/auth") {
        return <Navigate to="/auth"/>
    }

    return (
            <AuthContext.Provider value={{user, setUser}}>
                <div className="App">
                    <header className="App-header">
                        NotifyWave 🌊
                    </header>

                    <Outlet/>
                </div>
            </AuthContext.Provider>
    )
}
