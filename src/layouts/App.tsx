import React, {useEffect} from "react"
import {Navigate, Outlet} from "react-router-dom"
import Logo from "../components/logo/Logo"
import {useAuthState} from "../storage/AuthToken"
import NavigationItems from "../components/navigation/NavigationItems"
import MobileNavigationItems from "../components/navigation/MobileNavigationItems"
import SettingsIcon from "../components/icons/SettingsIcon"
import {TrackVisit} from "../storage/VisitTracker"
import {FeedbackWidget} from "../components/feedback/FeedbackWidget"
import {useAuthContext} from "../contexts/AuthContext";
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon";

export default function App() {
    const {isAuth} = useAuthState()
    const context = useAuthContext()

    TrackVisit()

    useEffect(() => {
        context.userState.setIsAuth(isAuth)
    }, [isAuth])

    if (context.userState.expired || !isAuth) {
        return <Navigate to="/auth/signup"/>
    }

    if (context.userState.user === null) {
        return <>
            <div className="flex flex-col gap-4 items-center animate-pulse justify-center pt-20 sm:pt-44 md:pt-64">
                <CircleArrowsIcon className="animate-spin h-6"/>
                <div>Loading…</div>
            </div>
        </>
    }

    return (
        <div className="">
            <header id="top-nav-menu"
                    className="flex flex-row space-x-4 items-center justify-between py-3 px-5 border-b soft-border text-sm fixed top-0 left-0 right-0 bg-white dark:bg-zinc-900 bg-opacity-70 dark:bg-opacity-50 z-30 drop-shadow-sm dark:drop-shadow-xl backdrop-blur-lg">
                <Logo/>
                <div className="hidden sm:block">
                    <NavigationItems/>
                </div>
                <div>
                    <ul className="flex flex-row space-x-4 items-center">
                        {/*{user?.subscription_type === "free" && (*/}
                        {/*    <li>*/}
                        {/*        <a href="/settings/billing"*/}
                        {/*           className="border border-red-200 hover:border-red-500 dark:border-red-800/50 dark:bg-red-700/25 dark:hover:border-red-800 smooth py-1.5 rounded-sm text-red-500 bg-red-50 px-2 uppercase text-xs">*/}
                        {/*            Upgrade*/}
                        {/*        </a>*/}
                        {/*    </li>*/}
                        {/*)}*/}
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

            <div id="app-container"
                 className="pt-[65px] pb-[81px] sm:pb-0">
                <Outlet/>
            </div>

            <FeedbackWidget/>

            <div id="bottom-nav-menu"
                 className="fixed bottom-0 left-0 right-0 p-4 border-t soft-border sm:hidden bg-white dark:bg-zinc-900 bg-opacity-70 dark:bg-opacity-50 backdrop-blur-lg drop-shadow-2xl z-30">
                <MobileNavigationItems/>
            </div>
        </div>
    )
}
