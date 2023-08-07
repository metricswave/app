import {useTriggersState} from "../storage/Triggers"
import {useNavigate, useParams} from "react-router-dom"
import {useUserServicesState} from "../storage/UserServices"
import {useEffect, useState} from "react"
import LoadingPage from "./LoadingPage"
import {Trigger as TriggerType} from "../types/Trigger"
import SectionContainer from "../components/sections/SectionContainer"
import TriggerDetails from "../components/triggers/TriggerDetails"
import TriggerAutomaticGraph from "../components/triggers/TriggerAutomaticGraph"

export default function Trigger() {
    const navigate = useNavigate()
    useUserServicesState()
    const [triggerUuid] = useState<string>(useParams().triggerUuid as string)
    const {triggers, triggerByUuid, refreshTriggers} = useTriggersState()
    const [trigger, setTrigger] = useState<TriggerType | undefined>(triggerByUuid(triggerUuid))

    useEffect(() => {
        const t = triggerByUuid(triggerUuid)
        if (t !== undefined) setTrigger(t)
    }, [triggers])

    if (trigger === undefined) {
        return <LoadingPage/>
    }

    return (
        <div className="pb-36">
            <SectionContainer>
                <TriggerDetails
                    trigger={trigger}
                    onDeleted={() => {
                        refreshTriggers()
                        navigate("/events")
                    }}
                />
            </SectionContainer>

            <TriggerAutomaticGraph trigger={trigger}/>

        </div>
    )
}
