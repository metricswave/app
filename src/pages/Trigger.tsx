import SectionContainer from "../components/sections/SectionContainer"
import {useTriggersState} from "../storage/Triggers"
import {useNavigate, useParams} from "react-router-dom"
import TriggerDetails from "../components/triggers/TriggerDetails"
import {useUserServicesState} from "../storage/UserServices"
import {useState} from "react"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"

export default function Trigger() {
    const navigate = useNavigate()
    useUserServicesState()
    const [triggerUuid] = useState<string>(useParams().triggerUuid as string)
    const {triggerByUuid, refreshTriggers} = useTriggersState()
    const trigger = triggerByUuid(triggerUuid)!
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
