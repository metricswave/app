import InputFieldBox from "../form/InputFieldBox"
import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox"
import {Trigger} from "../../types/Trigger"
import {DashboardItemSize, DashboardItemType} from "../../storage/Dashboard"
import PrimaryButton from "../form/PrimaryButton"
import {useState} from "react"
import {ChevronDownIcon, ChevronUpIcon} from "@radix-ui/react-icons"

type Props = {
    addButtonSize?: string
    title: string
    setTitle: (value: string) => void
    event: string
    setEvent: (value: string) => void
    triggers: Trigger[]
    selectedTrigger: Trigger | null
    size: DashboardItemSize
    setSize: (value: DashboardItemSize) => void
    type: DashboardItemType
    setType: (value: DashboardItemType) => void
    parameter: string
    setParameter: (value: string) => void
    submitButtonLabel?: string
    submitWidgetForm: () => void
    showMoveButtons?: boolean
    moveWidgetUp?: () => void
    canMoveUp?: boolean
    moveWidgetDown?: () => void
    canMoveDown?: boolean
}
export default function WidgetForm(
    {
        title,
        setTitle,
        event,
        setEvent,
        triggers,
        selectedTrigger,
        size,
        setSize,
        type,
        setType,
        parameter,
        setParameter,
        submitButtonLabel = "Add Widget",
        submitWidgetForm,
        showMoveButtons = false,
        canMoveUp = true,
        moveWidgetUp,
        canMoveDown = true,
        moveWidgetDown,
    }: Props,
) {
    const [titleError, setTitleError] = useState<string | false>(false)
    const [eventError, setEventError] = useState<string | false>(false)

    const handleSubmitWidgetForm = () => {
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

        if (!hasError) {
            submitWidgetForm()
        }
    }

    return (<>
        <div className="flex flex-col flex-grow w-full max-w-[400px] space-y-4">
            <div className="font-bold opacity-80 text-center pb-4">
                Configure your Widget
            </div>

            {showMoveButtons && (
                <div className="flex flex-row justify-between text-sm pb-4">
                    <div
                        className={[
                            "flex flex-row items-center gap-2 smooth-all",
                            canMoveUp ?
                                "hover:text-blue-500 cursor-pointer opacity-70 hover:opacity-100" :
                                "text-gray-400 opacity-50 cursor-default",
                        ].join(" ")}
                        onClick={moveWidgetUp}
                    >
                        <ChevronUpIcon/>
                        Move Up
                    </div>

                    <div className="border-r soft-border/50"></div>

                    <div
                        className={[
                            "flex flex-row items-center gap-2 smooth-all",
                            canMoveDown ?
                                "hover:text-blue-500 cursor-pointer opacity-70 hover:opacity-100" :
                                "text-gray-400 opacity-50 cursor-default",
                        ].join(" ")}
                        onClick={moveWidgetDown}
                    >
                        Move Down
                        <ChevronDownIcon/>
                    </div>
                </div>
            )}

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
                text={submitButtonLabel}
                onClick={handleSubmitWidgetForm}
            />
        </div>
    </>)
}
