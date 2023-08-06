import {useTriggersState} from "../storage/Triggers"
import {useNavigate, useParams} from "react-router-dom"
import {useUserServicesState} from "../storage/UserServices"
import {useEffect, useState} from "react"
import LoadingPage from "./LoadingPage"
import {Trigger as TriggerType} from "../types/Trigger"
import SectionContainer from "../components/sections/SectionContainer"
import TriggerDetails from "../components/triggers/TriggerDetails"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"

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

    const hasParams = trigger.configuration.fields["parameters"] !== undefined
        && trigger.configuration.fields["parameters"].length > 0

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

            <SectionContainer size="big">
                <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                    <TriggerStats trigger={trigger} title={"Hits"} defaultPeriod={"month"}/>
                </div>
            </SectionContainer>

            {hasParams && (
                <SectionContainer size="big">
                    <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                        <TriggerParamsStats trigger={trigger}/>
                    </div>
                </SectionContainer>
            )}
        </div>
    )
}
