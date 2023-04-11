import React, {useState} from "react"
import TriggersAddChooserStep from "./TriggersAddChooserStep"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import {TriggerType} from "../../types/TriggerType"

export default function TriggersAdd() {
    const {triggerTypes} = useTriggerTypesState()
    const [triggerType, setTriggerType] = useState<TriggerType | null>(null)

    return (
            <>
                {triggerType === null && <TriggersAddChooserStep triggerTypes={triggerTypes} chooser={setTriggerType}/>}

                {triggerType !== null && <div>
                    <h1>{triggerType.name}</h1>
                    <p>{triggerType.description}</p>
                </div>}
            </>
    )
}
