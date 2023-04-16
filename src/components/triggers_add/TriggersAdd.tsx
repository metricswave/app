import React, {useEffect, useState} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import {TriggerType} from "../../types/TriggerType"
import {NoLinkButton, SecondaryLinkButton} from "../buttons/LinkButton"
import TriggersAddChooserStep from "./TriggersAddChooserStep"
import {TriggersAddConfigureStep} from "./TriggersAddConfigureStep"

export default function TriggersAdd(
        {
            onDone: done = () => null,
            onLastStep: lastStep = () => null,
        }: {
            onDone?: () => void,
            onLastStep?: () => void
        },
) {
    const {triggerTypes} = useTriggerTypesState()
    const [triggerType, setTriggerType] = useState<TriggerType | null>(null)
    const [triggerCreated, setTriggerCreated] = useState<string | null>(null)

    useEffect(() => {
        if (triggerCreated !== null) {
            lastStep()
        }
    }, [triggerCreated])

    return (
            <>
                {triggerType === null &&
                        <TriggersAddChooserStep triggerTypes={triggerTypes} chooser={setTriggerType}/>
                }

                {triggerType !== null && triggerCreated === null &&
                        <TriggersAddConfigureStep
                                triggerType={triggerType}
                                onTriggerCreated={(uuid) => {
                                    setTriggerCreated(uuid)
                                }}
                                back={() => {
                                    setTriggerType(null)
                                }}
                        />
                }

                {triggerCreated !== null &&
                        <div className="flex flex-col space-y-4 items-center justify-center pt-12">
                            <h2 className="text-2xl mb-10">Trigger Created</h2>

                            <SecondaryLinkButton href={`/triggers/${triggerCreated}`} text="Go to trigger"/>

                            <Dialog.Close asChild>
                                <div>
                                    <NoLinkButton text="Done" onClick={done}/>
                                </div>
                            </Dialog.Close>
                        </div>
                }
            </>
    )
}
