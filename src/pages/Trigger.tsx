import SectionContainer from "../components/sections/SectionContainer"
import {useTriggersState} from "../storage/Triggers"
import {useNavigate, useParams} from "react-router-dom"
import TriggerDetails from "../components/triggers/TriggerDetails"
import {useUserServicesState} from "../storage/UserServices"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {useState} from "react"

export default function Trigger() {
    const navigate = useNavigate()
    useUserServicesState()
    const [triggerUuid] = useState<string>(useParams().triggerUuid as string)
    const {triggerByUuid, refreshTriggers} = useTriggersState()
    const trigger = triggerByUuid(triggerUuid)!

    return (
        <>
            <SectionContainer>
                <TriggerDetails
                    trigger={trigger}
                    onDeleted={() => {
                        refreshTriggers()
                        navigate("/triggers")
                    }}
                />
            </SectionContainer>

            <SectionContainer>
                <TriggerStats trigger={trigger}/>
            </SectionContainer>
        </>
    )
}
