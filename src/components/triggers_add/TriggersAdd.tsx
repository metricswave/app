import React, {useState} from "react"
import TriggersAddChooserStep from "./TriggersAddChooserStep"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import {TriggerType} from "../../types/TriggerType"
import {TriggersAddConfigureStep} from "./TriggersAddConfigureStep"

export default function TriggersAdd() {
    const {triggerTypes} = useTriggerTypesState()
    const [triggerType, setTriggerType] = useState<TriggerType | null>(null)

    return (
            <>
                {triggerType === null && <TriggersAddChooserStep triggerTypes={triggerTypes} chooser={setTriggerType}/>}

                {triggerType !== null && <TriggersAddConfigureStep triggerType={triggerType} back={() => {
                    setTriggerType(null)
                }}/>}
            </>
    )
}
