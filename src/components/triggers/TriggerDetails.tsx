import {Trigger} from "../../types/Trigger"
import {DialogHeader} from "../dialog/DialogHeader"
import * as Dialog from "@radix-ui/react-dialog"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import {NoLinkButton} from "../buttons/LinkButton"
import TriggerEditForm from "./TriggerEditForm"
import {useState} from "react"

export default function TriggerDetails({trigger}: { trigger: Trigger }) {
    const {getTriggerTypeById} = useTriggerTypesState()
    const triggerType = getTriggerTypeById(trigger.trigger_type_id)!
    const [step, setStep] = useState("details")

    return (
            <>

                {step === "details" &&
                        <>
                            <DialogHeader/>

                            <div className="mt-8 mb-4">
                                <Dialog.Title className="font-bold m-0 text-xl">
                                    Details
                                </Dialog.Title>

                                <div className="mt-2 mb-6 opacity-70 flex flex-row items-center space-x-2">
                                    <img src={`/images/trigger-types/${triggerType.icon}`}
                                         alt={triggerType.name}
                                         className="w-4 h-4 rounded-sm"/>
                                    <div className="">{triggerType.name}</div>
                                </div>
                            </div>

                            <NoLinkButton text="Edit" onClick={() => setStep("edit")}/>
                        </>
                }

                {step === "edit" &&
                        <TriggerEditForm trigger={trigger} onBack={() => setStep("details")}/>
                }
            </>
    )
}
