import SectionContainer from "../components/sections/SectionContainer"
import {useTriggersState} from "../storage/Triggers"
import {useNavigate, useParams} from "react-router-dom"
import TriggerDetails from "../components/triggers/TriggerDetails"
import {useUserServicesState} from "../storage/UserServices"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {useState} from "react"
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
                        navigate("/triggers")
                    }}
                />
            </SectionContainer>

            <SectionContainer size="big">
                <TriggerStats trigger={trigger}/>
            </SectionContainer>

            {hasParams && (
                <SectionContainer size="big">
                    <TriggerParamsStats trigger={trigger}/>
                </SectionContainer>
            )}
        </div>
    )
}
