import {useTriggersState} from "../storage/Triggers"
import {useEffect, useState} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {useUserUsageState} from "../storage/UserUsage"
import Logo from "../components/logo/Logo"
import PrimaryButton from "../components/form/PrimaryButton"
import {FIVE_MINUTES_SECONDS, FIVE_SECONDS, TWO_SECONDS} from "../helpers/ExpirableLocalStorage"
import SecondaryButton from "../components/form/SecondaryButton"
import EventTracker from "../helpers/EventTracker"
import {DeviceName} from "../storage/DeviceName"
import {useAuthContext} from "../contexts/AuthContext";
import {WelcomeDomainStep} from "./WelcomeDomainStep";
import {TrackingCodeIntegrationHelper} from "../components/team/TrackingCodeIntegrationHelper";


type Step = "loading" | "domain" | "add-code"

export function Welcome() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const context = useAuthContext()
    const user = context.userState.user
    const currentTeam = context.userState.currentTeam(context.teamState.currentTeamId)
    const {triggers, refreshTriggers, loadedTriggers} = useTriggersState()
    const {userUsage, loadedUsage, loadUsage} = useUserUsageState()
    const [step, setStep] = useState<Step>("loading")
    const [allowFinish, setAllowFinish] = useState(false)
    const [allowSkip, setAllowSkip] = useState(false)

    useEffect(() => {
        if (userUsage.usage > 0) setAllowFinish(true)
    }, [userUsage])

    useEffect(() => {
        if (!loadedUsage) return

        if (userUsage.usage > 0 && searchParams.get("force") !== "true") {
            navigate("/")
            return
        }

        fetchAuthApi("/users/defaults", {
            method: "POST",
            success: (data) => {
                context.userState.refreshUser(true)
                context.teamState.loadTeams(true)
                setStep("domain")
            },
            error: (error) => null,
            catcher: (e) => null,
        })
    }, [loadedUsage])

    useEffect(() => {
        if (context.userState.user === null) {
            return
        }

        context.teamState.setCurrentTeamFromTeams(context.userState.user, context.userState.user?.all_teams)
    }, [context.userState.user])

    useEffect(() => {
        const trigger = triggers[0]
        if (trigger !== undefined) {
            if (step === "loading") {
                setStep(
                    currentTeam?.domain !== "my-team.dev" ? "add-code" : "domain"
                )
            }
        }
    }, [triggers, step])

    useEffect(() => {
        if (allowFinish) {
            return
        }

        const interval = setInterval(loadUsage, TWO_SECONDS * 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        setTimeout(() => setAllowSkip(true), FIVE_SECONDS * 1000)
        setTimeout(() => setAllowFinish(true), FIVE_MINUTES_SECONDS * 1000)
    }, [])

    const handleFinish = () => {
        EventTracker.track("675c40d3-d5c8-44df-bcb5-7882d1959e45", {step: "Welcomed", user_id: DeviceName.name()})
        const referrer = localStorage.getItem("metricswave:referrer") ?? document.referrer
        EventTracker.track("f3fcf7cc-416d-4ff9-bc12-3878e9127ff7", {email: user?.email, referrer, step: 2})

        navigate("/")
    }

    if (step === "loading") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-pulse">
                <CircleArrowsIcon className="w-12 h-12 animate-spin"/>
            </div>
        )
    }

    if (step === "domain") {
        return (<WelcomeDomainStep onFinish={() => {
            context.userState.refreshUser(true)
            setStep("add-code")
        }}/>)
    }

    return (
        <div className="max-w-[600px] px-4 py-12 mx-auto flex flex-col space-y-14">
            <Logo/>

            <div className="flex flex-col space-y-4">
                <h2 className="text-xl sm:text-2xl">
                    Welcome 👋!
                </h2>

                <p className="sm:text-lg pt-3">
                    One last step to start tracking your metrics.
                </p>

                <p className="sm:text-lg">Integrate the tracking code on your site. There are different guides for each
                    platform:</p>


                <TrackingCodeIntegrationHelper
                    trigger={triggers[0]}
                    usage={userUsage.usage}
                />
            </div>

            <div>
                <PrimaryButton
                    onClick={() => {
                        if (!allowFinish) {
                            return
                        }

                        handleFinish()
                    }}
                    className={[
                        "w-full",
                        !allowFinish ? "bg-zinc-500/20 text-zinc-400 border-zinc-300 hover:bg-zinc-500/20 hover:text-zinc-600 hover:border-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-600 dark:border-zinc-700 hover:dark:bg-zinc-500/20 hover:dark:text-zinc-600 hover:dark:border-zinc-700 cursor-not-allowed" : "",
                    ].join(" ")}
                    text="Done →"
                />

                <SecondaryButton
                    className={[
                        "w-full mt-4 border-transparent shadow-none transition-all duration-300 text-sm",
                        (!allowSkip ? "opacity-0 cursor-default" : ""),
                    ].join(" ")}
                    onClick={() => {
                        handleFinish()
                    }}
                    text={"Skip for now"}
                />
            </div>
        </div>
    )
}
