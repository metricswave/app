import {Trigger} from "../../types/Trigger"
import {DialogHeader} from "../dialog/DialogHeader"
import * as Dialog from "@radix-ui/react-dialog"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import TriggerForm, {TriggerFormSubmit} from "./TriggerForm"
import {fetchAuthApi} from "../../helpers/ApiFetcher"

type Props = {
    trigger: Trigger
    onUpdate: () => void
    onBack: () => void
}

export default function TriggerEdit({trigger, onBack: back, onUpdate: updated}: Props) {
    const {getTriggerTypeById} = useTriggerTypesState()
    const triggerType = getTriggerTypeById(trigger.trigger_type_id)!

    const handleSubmit: TriggerFormSubmit = async (
            {emoji, title, content, values, via},
            setErrors,
    ) => {
        fetchAuthApi(`/triggers/${trigger.uuid}`, {
            method: "PUT",
            body: {
                emoji: emoji.native,
                title,
                content,
                "configuration": {
                    fields: values,
                    version: triggerType.configuration.version,
                },
                via,
            },
            success: () => {
                updated()
                back()
            },
            error: (error) => {
                setErrors(error.errors!)
            },
            catcher: (error) => null,
        })
    }

    return (
            <>
                <DialogHeader back={back}/>

                <div className="mt-8 mb-4">
                    <Dialog.Title className="font-bold m-0 text-xl">
                        Configure Trigger
                    </Dialog.Title>

                    <div className="mt-2 mb-6 opacity-70 flex flex-row items-center space-x-2">
                        <img src={`/images/trigger-types/${triggerType.icon}`}
                             alt={triggerType.name}
                             className="w-4 h-4 rounded-sm"/>
                        <div className="">{triggerType.name}</div>
                    </div>
                </div>

                <TriggerForm onSubmit={handleSubmit} triggerType={triggerType} trigger={trigger}/>
            </>
    )
}
