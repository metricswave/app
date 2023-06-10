import {useTriggerTypesState} from "../storage/TriggerTypes"
import TriggerForm, {TriggerFormSubmit} from "../components/triggers/TriggerForm"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import PageTitle from "../components/sections/PageTitle"
import {useNavigate, useParams} from "react-router-dom"
import {useTriggersState} from "../storage/Triggers"
import {useState} from "react"
import SectionContainer from "../components/sections/SectionContainer"

export default function TriggerEdit() {
    const navigate = useNavigate()
    const {getTriggerTypeById} = useTriggerTypesState()
    const [triggerUuid] = useState<string>(useParams().triggerUuid as string)
    const {triggerByUuid, refreshTriggers} = useTriggersState()

    const trigger = triggerByUuid(triggerUuid)!
    const triggerType = getTriggerTypeById(trigger.trigger_type_id)!

    const handleSubmit: TriggerFormSubmit = async (
        {emoji, title, content, values, via},
        setErrors,
    ) => {
        fetchAuthApi(`/triggers/${trigger.uuid}`, {
            method: "PUT",
            body: {
                emoji: emoji.native,
                title,
                content,
                "configuration": {
                    fields: values,
                    version: triggerType.configuration.version,
                },
                via,
            },
            success: () => {
                refreshTriggers()
                navigate(`/events${trigger.uuid}`)
            },
            error: (error) => {
                setErrors(error.errors!)
            },
            catcher: (error) => null,
        })
    }

    return (
        <SectionContainer>
            <PageTitle title="Configure Trigger"/>

            <div className="mt-2 pb-6 opacity-70 flex flex-row items-center space-x-2">
                <img src={`/images/trigger-types/${triggerType.icon}`}
                     alt={triggerType.name}
                     className="w-4 h-4 rounded-sm"/>
                <div className="">{triggerType.name}</div>
            </div>

            <TriggerForm onSubmit={handleSubmit} triggerType={triggerType} trigger={trigger}/>
        </SectionContainer>
    )
}
