import {useEffect, useState} from "react"
import {Trigger} from "../../types/Trigger"
import {useTriggersState} from "../../storage/Triggers"
import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox"
import InputFieldBox from "../form/InputFieldBox"
import PrimaryButton from "../form/PrimaryButton"
import {DashboardItem, DashboardItemSize, DashboardItemType} from "../../storage/Dashboard"
import {Cross1Icon} from "@radix-ui/react-icons"

type Props = {
    addButtonSize: string
    addWidgetToDashboard: (item: DashboardItem) => void
    defaultStep?: Steps
}

type Steps = "idle" | "selecting"

export function AddWidget({addButtonSize, addWidgetToDashboard, defaultStep}: Props) {
    const {triggers, triggerByUuid} = useTriggersState()
    const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null)

    const [step, setStep] = useState<Steps>(defaultStep ?? "idle")
    const [title, setTitle] = useState<string>("")
    const [titleError, setTitleError] = useState<string | false>(false)
    const [event, setEvent] = useState<string>("")
    const [eventError, setEventError] = useState<string | false>(false)
    const [size, setSize] = useState<DashboardItemSize>("base")
    const [type, setType] = useState<DashboardItemType>("stats")
    const [parameter, setParameter] = useState<string>("")

    useEffect(() => {
        if (event) {
            setSelectedTrigger(triggerByUuid(event)!)
        }
    }, [event])

    const submitWidgetForm = () => {
        let hasError = false

        if (title.length < 3) {
            setTitleError("Title must be at least 3 characters long.")
            hasError = true
        } else {
            setTitleError(false)
        }

        if (event === "") {
            setEventError("Event is required.")
            hasError = true
        } else {
            setEventError(false)
        }

        if (hasError) return

        setStep("idle")
        addWidgetToDashboard({
            title,
            eventUuid: event,
            size,
            type,
            parameter,
        })
    }

    if (step === "idle") {
        return <div
            className={`float-left ${addButtonSize} p-2.5`}
            onClick={() => setStep("selecting")}
        >
            <div className="bg-white dark:bg-zinc-900 bg-opacity-25 rounded-sm p-14 border-2 border-dashed soft-border flex items-center justify-center smooth hover:cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 hover:bg-opacity-70 group">
                <div className="opacity-40 group-hover:opacity-70">Add Widget</div>
            </div>
        </div>
    }

    return <div className={`relative float-left ${addButtonSize} p-2.5`}>
        <div
            className="absolute right-3 top-3 rounded-full cursor-pointer opacity-60 hover:opacity-90 smooth p-4"
            onClick={() => setStep("idle")}
        >
            <Cross1Icon/>
        </div>

        <div
            className="bg-white dark:bg-zinc-800 bg-opacity-70 rounded-sm p-6 sm:p-14 border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center smooth group"
        >

            <div className="flex flex-col space-y-4 max-w-full">
                <div className="font-bold opacity-80 text-center pb-4">
                    Configure your Widget
                </div>

                <InputFieldBox
                    value={title}
                    setValue={setTitle}
                    label={"Title"}
                    placeholder={"Title"}
                    name={"title"}
                    error={titleError}
                    focus
                />

                <DropDownSelectFieldBox
                    value={event}
                    error={eventError}
                    options={[
                        {
                            value: "",
                            label: "Select an Event",
                        },
                        ...triggers.map((trigger: Trigger) => ({
                            value: trigger.uuid,
                            label: trigger.title,
                        })),
                    ]}
                    setValue={(value) => {
                        setEvent(value as string)
                    }}
                    label={"Event"}
                    name={"event"}
                />

                <DropDownSelectFieldBox
                    value={size}
                    options={[
                        {
                            value: "base",
                            label: "Base",
                        },
                        {
                            value: "large",
                            label: "Large",
                        },
                    ]}
                    setValue={(value) => {
                        setSize(value as DashboardItemSize)
                    }}
                    label={"Size"}
                    name={"size"}
                />

                <DropDownSelectFieldBox
                    value={type}
                    options={[
                        {
                            value: "stats",
                            label: "Stats",
                        },
                        ...(
                            selectedTrigger?.configuration.fields.parameters !== undefined &&
                            selectedTrigger?.configuration.fields.parameters.length > 0 ?
                                [{
                                    value: "parameter",
                                    label: "Parameter",
                                }] :
                                []
                        ),
                    ]}
                    setValue={(value) => {
                        setType(value as DashboardItemType)
                    }}
                    label={"Type"}
                    name={"type"}
                />

                {
                    type === "parameter"
                    && selectedTrigger?.configuration.fields.parameters !== undefined
                    && selectedTrigger?.configuration.fields.parameters.length > 0
                    && <DropDownSelectFieldBox
                        value={parameter}
                        options={(selectedTrigger?.configuration.fields.parameters as string[]).map((parameter) => ({
                            value: parameter,
                            label: parameter,
                        }))}
                        setValue={(value) => {
                            setParameter(value as string)
                        }}
                        label={"Parameter"}
                        name={"parameter"}
                    />
                }

                <PrimaryButton
                    text={"Add Widget"}
                    onClick={submitWidgetForm}
                />
            </div>
        </div>
    </div>
}
