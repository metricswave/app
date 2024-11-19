import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Logo from "../components/logo/Logo";
import { useAuthState } from "../storage/AuthToken";
import NavigationItems from "../components/navigation/NavigationItems";
import MobileNavigationItems from "../components/navigation/MobileNavigationItems";
import SettingsIcon from "../components/icons/SettingsIcon";
import { TrackVisit } from "../storage/VisitTracker";
import { FeedbackWidget } from "../components/feedback/FeedbackWidget";
import { useAuthContext } from "../contexts/AuthContext";
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon";
import { TeamChooser } from "../components/team/TeamChooser";
import { currentPathIs, currentPathStartsWith } from "../helpers/Routes";

export default function App() {
    const { isAuth } = useAuthState();
    const context = useAuthContext();
    const currentTeam = context.teamState.team();
    const [showLimitBanner, setShowLimitBanner] = useState(false);
    const [limitType, setLimitType] = useState<false | "soft" | "hard">(false);

    TrackVisit();

    useEffect(() => {
        context.userState.setIsAuth(isAuth);
        context.userState.refreshUser();
        context.teamState.loadTeams();
    }, [isAuth]);

    useEffect(() => {
        const showLimitBanner = currentTeam?.limits.soft || currentTeam?.limits.hard || false;
        setShowLimitBanner(showLimitBanner);

        if (showLimitBanner) {
            const limitType: false | "soft" | "hard" = currentTeam?.limits.soft ? "soft" : "hard";
            setLimitType(limitType);
        }
    }, [currentTeam?.id]);

    if (context.userState.expired || !isAuth) {
        return <Navigate to="/auth/signup" />;
    }

    if (limitType === "hard" && !currentPathStartsWith("/settings")) {
        return <Navigate to="/settings/billing" />;
    }

    if (context.userState.user === null) {
        return (
            <>
                <div className="flex flex-col gap-4 items-center animate-pulse justify-center pt-20 sm:pt-44 md:pt-64">
                    <CircleArrowsIcon className="animate-spin h-6" />
                    <div>Loading…</div>
                </div>
            </>
        );
    }

    let paddingTop = "pt-[65px]";

    if (showLimitBanner) {
        paddingTop = "pt-[110px]";
    }

    return (
        <div className="">
            <header
                id="top-nav-menu"
                className="flex flex-col fixed top-0 left-0 right-0 border-b soft-border drop-shadow-sm dark:drop-shadow-xl z-30"
            >
                {showLimitBanner && (
                    <div className="bg-red-200 dark:bg-red-800/50 py-3 px-5">
                        <div className="text-sm mx-auto text-center">
                            {limitType === "soft"
                                ? "You have exceeded the limit of events allowed in your plan."
                                : "You have exceeded your site limit and can no longer access your Dashboard."}
                            {!currentPathIs("/settings/billing") && (
                                <a
                                    className="ml-2 text-red-700 dark:text-red-300 border-b border-dotted border-red-700 dark:border-red-300 font-bold"
                                    href="/settings/billing"
                                >
                                    Upgrade your site &rarr;
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-row space-x-4 items-center justify-between py-3 px-5 text-sm bg-white dark:bg-zinc-900 bg-opacity-70 dark:bg-opacity-50 backdrop-blur-lg">
                    <Logo />
                    <div className="hidden sm:block">
                        <NavigationItems />
                    </div>
                    <div>
                        <ul className="flex flex-row space-x-4 items-center">
                            <li>
                                <TeamChooser />
                            </li>
                            <li>
                                <a
                                    href="/settings/profile"
                                    className={[
                                        "flex flex-row items-center justify-center smooth hover:bg-[var(--menu-item-hover)] rounded-full p-3",
                                        window.location.pathname === "/settings" ? "bg-[var(--menu-item-active)]" : "",
                                    ].join(" ")}
                                >
                                    <SettingsIcon className="text-base" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            <div id="app-container" className={`${paddingTop} pb-[81px] sm:pb-0`}>
                <Outlet />
            </div>

            <FeedbackWidget />

            <div
                id="bottom-nav-menu"
                className="fixed bottom-0 left-0 right-0 p-4 border-t soft-border sm:hidden bg-white dark:bg-zinc-900 bg-opacity-70 dark:bg-opacity-50 backdrop-blur-lg drop-shadow-2xl z-30"
            >
                <MobileNavigationItems />
            </div>
        </div>
    );
}
