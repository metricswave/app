import {useEffect, useState} from "react"
import {Trigger} from "../../types/Trigger"
import {useTriggersState} from "../../storage/Triggers"
import WidgetForm from "./WidgetForm"
import {DashboardItem, DashboardItemSize, DashboardItemType} from "../../types/Dashboard";

type Props = {
    eventUuid: string,
    eventTitle: string,
    eventSize: "base" | "large",
    eventType: DashboardItemType,
    eventParameter?: string,
    closeWidgetForm: () => void,
    editWidget: (event: DashboardItem) => void,
}

export function EditWidget(
    {
        eventUuid,
        eventTitle,
        eventSize,
        eventType,
        eventParameter = "",
        closeWidgetForm,
        editWidget,
    }: Props,
) {
    const {triggers, triggerByUuid} = useTriggersState()
    const [selectedTrigger, setSelectedTrigger] = useState<Trigger>(triggerByUuid(eventUuid)!)

    const [title, setTitle] = useState<string>(eventTitle)
    const [event, setEvent] = useState<string>(eventUuid)
    const [size, setSize] = useState<DashboardItemSize>(eventSize)
    const [type, setType] = useState<DashboardItemType>(eventType)
    const [parameter, setParameter] = useState<string>(eventParameter)

    useEffect(() => {
        if (event) {
            setSelectedTrigger(triggerByUuid(event)!)
        }
    }, [event])

    const submitWidgetForm = () => {
        editWidget({
            title,
            eventUuid: event,
            size,
            type,
            ...(type === "parameter" ? {parameter} : {}),
        } as DashboardItem)
        closeWidgetForm()
    }

    return (<>
        <WidgetForm
            className="max-w-full"
            showTitle={false}
            title={title}
            setTitle={setTitle}
            event={event}
            setEvent={setEvent}
            triggers={triggers}
            selectedTrigger={selectedTrigger}
            size={size}
            setSize={setSize}
            type={type}
            setType={setType}
            parameter={parameter}
            setParameter={setParameter}
            submitWidgetForm={submitWidgetForm}
            submitButtonLabel={"Edit Widget"}
        />
    </>)
}
