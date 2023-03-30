import React from "react"
import {Navigate, Outlet} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import Logo from "../components/logo/Logo"
import {useUserState} from "../storage/User"
import {useAuthState} from "../storage/AuthToken"
import NavigationItems from "../components/navigation/NavigationItems"
import MobileNavigationItems from "../components/navigation/MobileNavigationItems"
import SettingsIcon from "../components/icons/SettingsIcon"

export default function App() {
    const {isAuth} = useAuthState()
    const {user, expired} = useUserState(isAuth)

    if (expired || !isAuth) {
        return <Navigate to="/auth/signup"/>
    }

    return (
            <AuthContext.Provider value={{user}}>
                <div className="">
                    <header className="flex flex-row space-x-4 items-center justify-between py-3 px-5 border-b soft-border text-sm">
                        <Logo/>
                        <div className="hidden sm:block">
                            <NavigationItems/>
                        </div>
                        <div>
                            <ul className="flex flex-row space-x-4">
                                <li>
                                    <a href="/settings/profile"
                                       className={[
                                           "flex flex-row items-center justify-center smooth hover:bg-[var(--menu-item-hover)] rounded-full p-3",
                                           (
                                                   window.location.pathname === "/settings"
                                                           ? "bg-[var(--menu-item-active)]"
                                                           : ""
                                           ),
                                       ].join(" ")}>
                                        <SettingsIcon className="text-base"/>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </header>

                    <div className="pb-[80px] sm:pb-0">
                        <Outlet/>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 border-t soft-border sm:hidden bg-[var(--background-color)] drop-shadow-2xl">
                        <MobileNavigationItems/>
                    </div>
                </div>
            </AuthContext.Provider>
    )
}
