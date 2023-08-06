import React, {useEffect, useState} from "react"
import {WebhookTriggerType} from "../../types/TriggerType"
import WebhookTriggerTypeChooser from "./TriggersAddChooserStep"
import {TriggersAddConfigureStep} from "./TriggersAddConfigureStep"
import {useNavigate} from "react-router-dom"

export default function TriggersAdd(
    {
        onDone: done = () => null,
        onLastStep: lastStep = () => null,
    }: {
        onDone?: () => void,
        onLastStep?: () => void
    },
) {
    const [triggerType, setTriggerType] = useState<WebhookTriggerType | null>(null)
    const [triggerCreated, setTriggerCreated] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (triggerCreated !== null) {
            lastStep()
            navigate(`/events/${triggerCreated}`)
        }
    }, [triggerCreated])

    return (
        <>
            {triggerType === null &&
                <WebhookTriggerTypeChooser chooser={setTriggerType}/>
            }

            {triggerType !== null && triggerCreated === null &&
                <TriggersAddConfigureStep
                    webhookTriggerType={triggerType}
                    onTriggerCreated={(uuid) => {
                        setTriggerCreated(uuid)
                    }}
                />
            }
        </>
    )
}
