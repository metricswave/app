import {TriggerType, WebhookTriggerType} from "../../types/TriggerType"
import * as Dialog from "@radix-ui/react-dialog"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {generateUuid} from "../../helpers/UuidGenerator"
import TriggerForm, {TriggerFormSubmit} from "../triggers/TriggerForm"
import {useTriggerTypesState} from "../../storage/TriggerTypes"

type Props = {
    webhookTriggerType: WebhookTriggerType
    onTriggerCreated: (uuid: string) => void
}

export const TriggersAddConfigureStep = ({webhookTriggerType, onTriggerCreated: triggerCreated}: Props) => {
    const triggerType: TriggerType = useTriggerTypesState().defaultTriggerType!
    const handleSubmit: TriggerFormSubmit = async (
        {emoji, title, content, values, via, type, steps},
        setErrors,
    ) => {
        const uuid = generateUuid()

        fetchAuthApi("/triggers", {
            method: "POST",
            body: {
                uuid,
                "trigger_type_id": triggerType.id,
                "emoji": emoji.native,
                title,
                content,
                via,
                "configuration": {
                    fields: values,
                    type,
                    ...(type === "funnel" && {steps}),
                    version: triggerType.configuration.version,
                },
            },
            success: (response) => {
                triggerCreated(uuid)
            },
            error: (error) => {
                setErrors(error.errors!)
            },
            catcher: (error) => {
            },
        })
    }

    return (
        <>
            <div className="mb-4">
                <Dialog.Title className="font-bold m-0 text-xl">
                    Configure your Event
                </Dialog.Title>

                <Dialog.Description className="mt-2 mb-6 opacity-70">
                    Set title, content, emoji, and configure your event parameters.
                </Dialog.Description>
            </div>

            <TriggerForm
                onSubmit={handleSubmit}
                triggerType={triggerType}
                webhookTriggerType={webhookTriggerType}
            />
        </>
    )
}
