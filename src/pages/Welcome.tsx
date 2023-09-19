import {useTriggersState, visitGoogleTagManagerSnippet, visitSnippet} from "../storage/Triggers"
import {useEffect, useState} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {useUserUsageState} from "../storage/UserUsage"
import Logo from "../components/logo/Logo"
import CopyButton from "../components/form/CopyButton"
import PrimaryButton from "../components/form/PrimaryButton"
import {CheckIcon} from "@radix-ui/react-icons"
import {FIVE_MINUTES_SECONDS, FIVE_SECONDS, TWO_SECONDS} from "../helpers/ExpirableLocalStorage"
import SecondaryButton from "../components/form/SecondaryButton"
import EventTracker from "../helpers/EventTracker"
import {DeviceName} from "../storage/DeviceName"
import {useAuthContext} from "../contexts/AuthContext";
import {WelcomeDomainStep} from "./WelcomeDomainStep";
import DropDownSelectFieldBox from "../components/form/DropDownSelectFieldBox";


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
    const [snippet, setSnippet] = useState("")
    const [formattedSnippet, setFormattedSnippet] = useState("")
    const platforms = [
        {label: "Common Webpage", value: "Common Webpage"},
        {label: "Google Tag Manager", value: "Google Tag Manager"},
        {label: "WordPress", value: "WordPress"},
        {label: "React", value: "React"},
        {label: "Next.js", value: "Next.js"},
        {label: "Svelte", value: "Svelte"},
        {label: "FlutterFlow", value: "FlutterFlow"},
        {label: "Other", value: "Other"},
    ]
    const [selectedPlatform, setSelectedPlatform] = useState<string | string[]>("HTML & Javascript")

    let documentationLink = "https://metricswave.com/documentation/integrations/html-and-javascript"
    switch (selectedPlatform) {
        case "Google Tag Manager":
            documentationLink = "https://metricswave.com/documentation/integrations/google-tag-manager"
            break
        case "WordPress":
            documentationLink = "https://metricswave.com/documentation/integrations/wordpress"
            break
        case "React":
            documentationLink = "https://metricswave.com/documentation/integrations/react"
            break
        case "Next.js":
            documentationLink = "https://metricswave.com/documentation/integrations/next-js"
            break
        case "Svelte":
            documentationLink = "https://metricswave.com/documentation/integrations/svelte"
            break
        case "FlutterFlow":
            documentationLink = "https://metricswave.com/documentation/integrations/flutterflow"
            break
    }

    useEffect(() => {
        if (userUsage.usage > 0) setAllowFinish(true)
    }, [userUsage])

    useEffect(() => {
        if (!loadedTriggers || !loadedUsage) {
            return
        }

        if (userUsage.usage > 0 && searchParams.get("force") !== "true") {
            navigate("/")
            return
        }

        fetchAuthApi("/users/defaults", {
            method: "POST",
            success: (data) => {
                context.userState.refreshUser()
                refreshTriggers()
            },
            error: (error) => null,
            catcher: (e) => null,
        })
    }, [loadedTriggers, loadedUsage])

    useEffect(() => {
        const trigger = triggers[0]
        if (trigger !== undefined) {
            if (selectedPlatform !== "Google Tag Manager") {
                setSnippet(visitSnippet(trigger))
                setFormattedSnippet(visitSnippet(trigger, true))
            } else {
                setSnippet(visitGoogleTagManagerSnippet(trigger))
                setFormattedSnippet(visitGoogleTagManagerSnippet(trigger, true))
            }

            if (step === "loading") {
                setStep(
                    currentTeam?.domain !== "my-team.dev" ? "add-code" : "domain"
                )
            }
        }
    }, [triggers, step, selectedPlatform])

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
            context.userState.refreshUser()
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

                <div className="flex flex-col gap-2 pt-4">
                    <div>
                        <DropDownSelectFieldBox
                            value={selectedPlatform}
                            options={platforms}
                            setValue={setSelectedPlatform}
                            label="Platform"
                            name="platform"
                        />
                    </div>

                    <div className="bg-white dark:bg-zinc-800/25 soft-border border shadow p-4 rounded whitespace-pre-wrap break-words max-w-full text-xs flex flex-col gap-6">
                        <pre className="select-all">{formattedSnippet}</pre>

                        <small className="text-blue-500 hover:underline transition-all duration-300 text-center">
                            <a target="_blank"
                               href={documentationLink}>
                                Documentation about {selectedPlatform}
                            </a>
                        </small>
                    </div>

                    <CopyButton
                        textToCopy={snippet}
                        className="w-full bg-transparent text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/25"
                    />

                    <div className="text-sm mt-3">
                        {(userUsage.usage > 0) && (
                            <div className="text-green-500 flex flex-row items-center justify-center space-x-4 border border-green-500/10 rounded-sm py-3">
                                <CheckIcon className="h-4 w-4"/>
                                <div>Event received</div>
                            </div>)}

                        {(userUsage.usage === 0) && (<>
                            <div className="animate-pulse flex flex-col gap-2 items-center py-4 border rounded-sm soft-border">
                                <div className="flex flex-row items-center justify-center gap-4">
                                    <CircleArrowsIcon className="animate-spin h-4 w-4"/>
                                    <div>Waiting first event</div>
                                </div>

                                <div
                                    className="w-full text-center text-xs pb-1 pt-3 flex flex-col items-center justify-center gap-4">
                                    <a
                                        href="https://metricswave.com/documentation/analytics#are-you-in-localhost-or-test-environment"
                                        target="_blank"
                                        title="Are you in localhost?"
                                        className="border-b border-dotted opacity-50 hover:opacity-80 hover:text-blue-500 hover:border-blue-500 smooth-all"
                                    >
                                        Are you in localhost?
                                    </a>
                                </div>
                            </div>
                        </>)}
                    </div>
                </div>
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
