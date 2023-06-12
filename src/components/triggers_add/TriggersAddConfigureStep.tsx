import {TriggerType} from "../../types/TriggerType"
import * as Dialog from "@radix-ui/react-dialog"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {generateUuid} from "../../helpers/UuidGenerator"
import TriggerForm, {TriggerFormSubmit} from "../triggers/TriggerForm"

type Props = {
    triggerType: TriggerType
    onTriggerCreated: (uuid: string) => void
}

export const TriggersAddConfigureStep = ({triggerType, onTriggerCreated: triggerCreated}: Props) => {
    const handleSubmit: TriggerFormSubmit = async (
        {emoji, title, content, values, via},
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
            />
        </>
    )
}
