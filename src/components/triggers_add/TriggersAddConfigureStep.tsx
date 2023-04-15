import {TriggerType} from "../../types/TriggerType"
import * as Dialog from "@radix-ui/react-dialog"
import {DialogHeader} from "../dialog/DialogHeader"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {generateUuid} from "../../helpers/UuidGenerator"
import TriggerForm, {TriggerFormSubmit} from "../triggers/TriggerForm"

type Props = {
    triggerType: TriggerType
    back: () => void,
    onTriggerCreated: (uuid: string) => void
}

export const TriggersAddConfigureStep = ({triggerType, back, onTriggerCreated: triggerCreated}: Props) => {
    const handleSubmit: TriggerFormSubmit = async (
            {emoji, title, content, values},
    ) => {
        // todo: validate fields

        const uuid = generateUuid()

        fetchAuthApi("/triggers", {
            method: "POST",
            body: {
                "uuid": uuid,
                "trigger_type_id": triggerType.id,
                "emoji": emoji.native,
                "title": title,
                "content": content,
                "configuration": {
                    fields: values,
                    version: triggerType.configuration.version,
                },
            },
            success: (response) => {
                triggerCreated(uuid)
            },
            error: (error) => {
                // todo: manage invalid form errors
            },
            catcher: (error) => {
            },
        })
    }

    return (
            <>
                <DialogHeader back={back}/>

                <div className="mt-8 mb-4">
                    <Dialog.Title className="font-bold m-0 text-xl">
                        Configure your notification
                    </Dialog.Title>

                    <Dialog.Description className="mt-2 mb-6 opacity-70">
                        Set a title, a description, and emoji and configure your trigger type.
                    </Dialog.Description>
                </div>

                <TriggerForm
                        onSubmit={handleSubmit}
                        triggerType={triggerType}
                />
            </>
    )
}
