import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox";
import CopyButton from "../form/CopyButton";
import {CheckIcon} from "@radix-ui/react-icons";
import CircleArrowsIcon from "../icons/CircleArrowsIcon";
import {useEffect, useState} from "react";
import {visitGoogleTagManagerSnippet, visitSnippet} from "../../storage/Triggers";
import {Trigger} from "../../types/Trigger";

type Props = {
    trigger: Trigger,
    usage: number,
}

export function TrackingCodeIntegrationHelper({trigger, usage}: Props) {
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
        if (selectedPlatform !== "Google Tag Manager") {
            setSnippet(visitSnippet(trigger))
            setFormattedSnippet(visitSnippet(trigger, true))
        } else {
            setSnippet(visitGoogleTagManagerSnippet(trigger))
            setFormattedSnippet(visitGoogleTagManagerSnippet(trigger, true))
        }
    }, [selectedPlatform]);

    return (<div className="flex flex-col gap-2 pt-4">
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
            {(usage > 0) && (
                <div className="text-green-500 flex flex-row items-center justify-center space-x-4 border border-green-500/10 rounded-sm py-3">
                    <CheckIcon className="h-4 w-4"/>
                    <div>Event received</div>
                </div>)}

            {(usage === 0) && (<>
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
    </div>)
}
