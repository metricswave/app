import {Trigger, TriggerTypeId} from "../../types/Trigger"
import {ReactElement} from "react"
import DeleteButton from "../form/DeleteButton"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {CopyButtonIcon} from "../form/CopyButton"
import {useNavigate} from "react-router-dom"
import {Pencil1Icon} from "@radix-ui/react-icons"
import SecondaryButton from "../form/SecondaryButton"
import {WebhookTriggerDetails} from "./WebhookTriggerDetails"

type Props = {
    trigger: Trigger
    onDeleted: () => void
}

export default function TriggerDetails({trigger, onDeleted: deleted}: Props) {
    const navigate = useNavigate()

    const handleDelete = async () => {
        await fetchAuthApi(`/triggers/${trigger.uuid}`, {
            method: "DELETE",
            success: deleted,
            error: () => null,
            catcher: () => null,
        })
    }

    const triggerInstructions = (trigger: Trigger): ReactElement => {
        switch (trigger.trigger_type_id) {
            case TriggerTypeId.Webhook:
                return (<WebhookTriggerDetails trigger={trigger}/>)
            default:
                return (<></>)
        }
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start justify-center sm:items-center sm:justify-between">
                <div className="flex flex-col space-y-2 mb-4k">
                    <h1 className="text-lg font-bold">{`${trigger.emoji} ${trigger.title}`}</h1>
                    <div className="text-sm opacity-70 flex flex-row gap-3 items-center">
                        <div className="pt-[2px]"><strong>UUID:</strong> {trigger.uuid}</div>
                        <CopyButtonIcon textToCopy={trigger.uuid}/>
                    </div>
                </div>
                <div className="flex flex-row space-x-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <SecondaryButton onClick={() => navigate(`/events/${trigger.uuid}/edit`)}
                                     className="w-full sm:w-auto flex flex-row items-center space-x-3">
                        <Pencil1Icon/> <span className="sm:hidden">Edit</span>
                    </SecondaryButton>
                    <DeleteButton justIcon onClick={handleDelete}/>
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="py-2">
                    {triggerInstructions(trigger)}
                </div>
            </div>
        </>
    )
}
