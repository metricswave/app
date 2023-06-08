import React, {useEffect} from "react"
import {Navigate, Outlet, useLocation} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import Logo from "../components/logo/Logo"
import {useUserState} from "../storage/User"
import {useAuthState} from "../storage/AuthToken"
import NavigationItems from "../components/navigation/NavigationItems"
import MobileNavigationItems from "../components/navigation/MobileNavigationItems"
import SettingsIcon from "../components/icons/SettingsIcon"
import * as amplitude from "@amplitude/analytics-browser"

export default function App() {
    const {isAuth} = useAuthState()
    const {user, expired} = useUserState(isAuth)
    const location = useLocation()

    useEffect(() => {
        fetch("https://notifywave.com/webhooks/f41ff0fd-4475-499c-b086-82d6012bbf16?path=" + location.pathname, {mode: "no-cors"})
    }, [location])

    if (expired || !isAuth) {
        return <Navigate to="/auth/signup"/>
    }
    amplitude.init("4e2324f891c91461b816f3a7f41b6da6", undefined, {
        defaultTracking: {
            sessions: true,
            pageViews: true,
            formInteractions: true,
            fileDownloads: true,
        },
    })

    return (
        <AuthContext.Provider value={{user}}>
            <div className="">
                <header id="top-nav-menu"
                        className="flex flex-row space-x-4 items-center justify-between py-3 px-5 border-b soft-border text-sm fixed top-0 left-0 right-0 bg-[var(--background-color)] z-30 drop-shadow-sm dark:drop-shadow-xl">
                    <Logo/>
                    <div className="hidden sm:block">
                        <NavigationItems/>
                    </div>
                    <div>
                        <ul className="flex flex-row space-x-4 items-center">
                            {user?.subscription_type === "free" && (
                                <li>
                                    <a href="/settings/billing"
                                       className="border border-red-200 hover:border-red-500 dark:border-red-800/50 dark:bg-red-700/25 dark:hover:border-red-800 smooth py-1.5 rounded-sm text-red-500 bg-red-50 px-2 uppercase text-xs">
                                        Upgrade
                                    </a>
                                </li>
                            )}
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

                <div id="app-container" className="pt-[65px] pb-[81px] sm:pb-0">
                    <Outlet/>
                </div>

                <div id="bottom-nav-menu"
                     className="fixed bottom-0 left-0 right-0 p-4 border-t soft-border sm:hidden bg-[var(--background-color)] drop-shadow-2xl z-30">
                    <MobileNavigationItems/>
                </div>
            </div>
        </AuthContext.Provider>
    )
}
