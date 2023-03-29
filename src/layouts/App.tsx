import React from "react"
import {Navigate, Outlet} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import {User} from "../types/User"
import {Tokens} from "../types/Token"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import Logo from "../components/logo/Logo"

export default function App() {
    const [tokens] = React.useState<Tokens | null>(
            localStorage.getItem("nw:auth")
                    ? JSON.parse(localStorage.getItem("nw:auth") as string) as Tokens
                    : null,
    )
    const [user, setUser] = React.useState<User | null>(
            localStorage.getItem("nw:user")
                    ? JSON.parse(localStorage.getItem("nw:user") as string) as User
                    : null,
    )

    if (!tokens) {
        return <Navigate to="/auth/signup"/>
    } else if (!user) {
        // todo: 🐛 Error. We are making this API call twice, DKW!
        fetchAuthApi<User>("/users", {
            success: (data) => {
                localStorage.setItem("nw:user", JSON.stringify(data.data))
                setUser(data.data)
            },
            error: (data) => <Navigate to="/auth/signup"/>,
            catcher: (err) => <Navigate to="/auth/signup"/>,
        })
    }

    return (
            <AuthContext.Provider value={{user, setUser}}>
                <div className="App">
                    <header className="App-header">
                        <Logo/>
                    </header>

                    <Outlet/>
                </div>
            </AuthContext.Provider>
    )
}
