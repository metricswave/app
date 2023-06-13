import {useTriggersState} from "../storage/Triggers"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {useUserUsageState} from "../storage/UserUsage"
import Logo from "../components/logo/Logo"
import CopyButton from "../components/form/CopyButton"
import PrimaryButton from "../components/form/PrimaryButton"
import {CheckIcon} from "@radix-ui/react-icons"
import {FIVE_MINUTES_SECONDS, TWO_SECONDS} from "../helpers/ExpirableLocalStorage"
import {useUserState} from "../storage/User"


type Step = "loading" | "add-code"

export function Welcome() {
    const navigate = useNavigate()
    const {user} = useUserState(true)
    const {triggers, refreshTriggers, loadedTriggers} = useTriggersState()
    const {userUsage, loadedUsage, loadUsage} = useUserUsageState()
    const [step, setStep] = useState<Step>("loading")
    const [allowFinish, setAllowFinish] = useState(false)
    const [snippet, setSnippet] = useState("")

    useEffect(() => {
        if (userUsage.usage > 0) {
            setAllowFinish(true)
        }
    }, [userUsage])

    useEffect(() => {
        if (!loadedTriggers || !loadedUsage) {
            return
        }

        if (userUsage.usage > 0) {
            navigate("/")
            return
        }

        fetchAuthApi("/users/defaults", {
            method: "POST",
            success: (data) => {
                refreshTriggers()
                setStep("add-code")
            },
            error: (error) => null,
            catcher: (e) => null,
        })
    }, [loadedTriggers, loadedUsage])

    useEffect(() => {
        setSnippet(`<script>fetch('https://metricswave.com/webhooks/${triggers.pop()?.uuid}?path='+window.location.pathname +'&language='+window.navigator.language+'&userAgent='+window.navigator.userAgent+'&platform='+window.navigator.platform+'&referrer='+document.referrer)</script>`)
    }, [triggers])

    useEffect(() => {
        if (allowFinish) {
            return
        }

        const interval = setInterval(loadUsage, TWO_SECONDS * 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        setTimeout(() => setAllowFinish(true), FIVE_MINUTES_SECONDS * 1000)
    }, [])

    if (step === "loading") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-pulse">
                <CircleArrowsIcon className="w-12 h-12 animate-spin"/>
            </div>
        )
    }

    return (
        <div className="max-w-[var(--landing-max-width)] px-4 py-12 mx-auto flex flex-col space-y-14">
            <Logo/>

            <div className="flex flex-col space-y-4">
                <h2 className="text-xl sm:text-2xl">
                    Welcome 👋!
                </h2>

                <p className="text-lg sm:text-xl pt-3">
                    You are now ready to start using the app, but first you need to add the javascript snippet.
                </p>

                <p className="sm:text-lg">Copy and paste the next code in the <code>head</code> tag of your site:</p>

                <div>
                    <pre className="bg-white dark:bg-zinc-800 soft-border border shadow p-5 rounded whitespace-pre-wrap break-words block max-w-full select-all">{snippet}</pre>
                    <CopyButton textToCopy={snippet}
                                className="w-full bg-transparent text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/25 mt-3"/>
                </div>
            </div>

            <div>
                <div className="pb-10">
                    {userUsage.usage > 0 && (
                        <div className="text-green-500 flex flex-row items-center justify-center space-x-4">
                            <CheckIcon className="h-4 w-4"/>
                            <div>Event received</div>
                        </div>)}

                    {userUsage.usage === 0 && (
                        <div className="animate-pulse flex flex-row items-center justify-center space-x-4">
                            <CircleArrowsIcon className="animate-spin h-4 w-4"/>
                            <div>Waiting first event</div>
                        </div>)}
                </div>

                <PrimaryButton
                    onClick={() => {
                        if (!allowFinish) {
                            return
                        }

                        const referrer = localStorage.getItem("nw:referrer") ?? document.referrer
                        fetch(`https://metricswave.com/webhooks/f3fcf7cc-416d-4ff9-bc12-3878e9127ff7?email=${user?.email}&referrer=${referrer}&step=2`)

                        navigate("/")
                    }}
                    className={[
                        "w-full",
                        !allowFinish ? "bg-zinc-500/20 text-zinc-400 border-zinc-300 hover:bg-zinc-500/20 hover:text-zinc-600 hover:border-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-600 dark:border-zinc-700 hover:dark:bg-zinc-500/20 hover:dark:text-zinc-600 hover:dark:border-zinc-700 cursor-not-allowed" : "",
                    ].join(" ")}
                    text="Done →"
                />
            </div>
        </div>
    )
}
