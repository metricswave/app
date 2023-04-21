import {Trigger, TriggerType} from "../../types/Trigger"
import {DialogHeader} from "../dialog/DialogHeader"
import * as Dialog from "@radix-ui/react-dialog"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import TriggerEdit from "./TriggerEdit"
import {ReactElement, useState} from "react"
import PrimaryButton from "../form/PrimaryButton"
import DeleteButton from "../form/DeleteButton"
import InputFieldBox from "../form/InputFieldBox"
import {app} from "../../config/app"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {LinkButton} from "../buttons/LinkButton"
import CopyButton from "../form/CopyButton"

type Props = {
    trigger: Trigger
    onDeleted: () => void
    onUpdate: () => void
}

export default function TriggerDetails({trigger, onDeleted: deleted, onUpdate: updated}: Props) {
    const {getTriggerTypeById} = useTriggerTypesState()
    const triggerType = getTriggerTypeById(trigger.trigger_type_id)!
    const [step, setStep] = useState("details")

    const listFormatter = new Intl.ListFormat("en")

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
            case TriggerType.OnTime:
                return (<>
                    <p>
                        You will receive a notification
                        all {listFormatter.format(trigger.configuration.fields.weekdays)} at {trigger.configuration.fields.time}.
                    </p>

                    <p className="pb-1">
                        <LinkButton href={`${app.web}/documentation/triggers/on-time`}
                                    text="More info about On Time triggers."/>
                    </p>
                </>)
            case TriggerType.Webhook:
                const query = trigger.configuration.fields.parameters
                        .map((param) => `${param}={value}`)
                        .join("&")
                const url = `${app.webhooks}/${trigger.uuid}?${query}`

                return (<div className="flex flex-col space-y-4">
                    <p>Call or open the next URL and you will receive a notification
                        instantly.</p>

                    <p className="pb-1">
                        <LinkButton target="_blank"
                                    href={`${app.web}/documentation/triggers/webhooks`}
                                    text="Here you can find more info about webhooks."/>
                    </p>

                    <div>
                        <InputFieldBox
                                value={url}
                                setValue={() => null}
                                label="Webhook Path"
                                name="webhook_path"
                                placeholder=""
                                disabled
                        />

                        <CopyButton textToCopy={url} className="w-full mt-2"/>
                    </div>

                </div>)
            default:
                return (<></>)
        }
    }

    return (
            <>
                {step === "details" &&
                        <>
                            <DialogHeader/>

                            <div className="flex flex-col space-y-4">
                                <div className="">
                                    <Dialog.Title className="font-bold m-0 text-xl">
                                        {trigger.emoji} {trigger.title}
                                    </Dialog.Title>

                                    <div className="mt-2 opacity-70 flex flex-row items-center space-x-2">
                                        <img src={`/images/trigger-types/${triggerType.icon}`}
                                             alt={triggerType.name}
                                             className="w-4 h-4 rounded-sm"/>
                                        <div className="">{triggerType.name}</div>
                                    </div>
                                </div>

                                <div className="py-4">
                                    {triggerInstructions(trigger)}
                                </div>

                                <div className="w-full flex flex-col space-y-3">
                                    <PrimaryButton text="Edit" onClick={() => setStep("edit")} className="w-full"/>
                                    <DeleteButton text="Delete"
                                                  onClick={handleDelete}
                                                  className="w-full"/>
                                </div>
                            </div>
                        </>
                }

                {step === "edit" &&
                        <TriggerEdit onUpdate={updated} trigger={trigger} onBack={() => setStep("details")}/>
                }
            </>
    )
}
