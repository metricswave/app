import React from "react"
import {Navigate, Outlet} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import Logo from "../components/logo/Logo"
import {useUserState} from "../storage/User"
import {useAuthState} from "../storage/AuthToken"

export default function App() {
    const {isAuth} = useAuthState()
    const {user, expired} = useUserState(isAuth)

    if (expired || !isAuth) {
        return <Navigate to="/auth/signup"/>
    }

    return (
            <AuthContext.Provider value={{user}}>
                <div className="App">
                    <header className="App-header">
                        <Logo/>
                    </header>

                    <Outlet/>
                </div>
            </AuthContext.Provider>
    )
}
