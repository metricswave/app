import InputFieldBox from "../form/InputFieldBox";
import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox";
import { Trigger } from "../../types/Trigger";
import PrimaryButton from "../form/PrimaryButton";
import { useEffect, useState } from "react";
import { twMerge } from "../../helpers/TwMerge";
import { DashboardItemSize, DashboardItemType } from "../../types/Dashboard";
import { mapParameterName } from "../../helpers/TriggerParameters";

type Props = {
    addButtonSize?: string;
    title: string;
    setTitle: (value: string) => void;
    event: string;
    setEvent: (value: string) => void;
    triggers: Trigger[];
    selectedTrigger: Trigger | null;
    size: DashboardItemSize;
    setSize: (value: DashboardItemSize) => void;
    type: DashboardItemType;
    setType: (value: DashboardItemType) => void;
    parameter: string;
    setParameter: (value: string) => void;
    submitButtonLabel?: string;
    submitWidgetForm: () => void;
    showTitle?: boolean;
    className?: string;
};

function getTypeOptionsForTrigger(selectedTrigger: Trigger | null) {
    if (selectedTrigger?.configuration.type === "funnel") {
        return [
            {
                value: "funnel",
                label: "Funnel",
            },
        ];
    }

    const hasParameters =
        selectedTrigger?.configuration.fields.parameters !== undefined &&
        selectedTrigger?.configuration.fields.parameters.length > 0;

    return [
        {
            value: "stats",
            label: "Stats",
        },
        {
            value: "number",
            label: "Number",
        },
        ...(hasParameters
            ? [
                  {
                      value: "parameter",
                      label: "Parameter",
                  },
              ]
            : []),
    ];
}

export default function WidgetForm({
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
    showTitle = true,
    className = "",
}: Props) {
    const [titleError, setTitleError] = useState<string | false>(false);
    const [eventError, setEventError] = useState<string | false>(false);
    const [typesOptions, setTypesOptions] = useState<{ value: string; label: string }[]>([]);

    const parameters =
        selectedTrigger !== null
            ? [...(selectedTrigger?.configuration.fields.parameters as string[]), "user_parameter"]
            : [];

    const handleSubmitWidgetForm = () => {
        let hasError = false;

        if (title.length < 3) {
            setTitleError("Title must be at least 3 characters long.");
            hasError = true;
        } else {
            setTitleError(false);
        }

        if (event === "") {
            setEventError("Event is required.");
            hasError = true;
        } else {
            setEventError(false);
        }

        if (!hasError) {
            submitWidgetForm();
        }
    };

    useEffect(() => {
        setTypesOptions(getTypeOptionsForTrigger(selectedTrigger));
    }, [selectedTrigger]);

    useEffect(() => {
        if (typesOptions.length > 0 && typesOptions.findIndex((option) => option.value === type) === -1) {
            setType(typesOptions[0].value as DashboardItemType);
        }
    }, [typesOptions]);

    useEffect(() => {
        if (type === "parameter" && selectedTrigger?.configuration.fields.parameters.indexOf(parameter) === -1) {
            setParameter(selectedTrigger?.configuration.fields.parameters[0]!);
        } else if (type !== "parameter") {
            setParameter("");
        }
    }, [type]);

    return (
        <>
            <div className={twMerge("flex flex-col flex-grow w-full max-w-[400px] space-y-4", className ?? "")}>
                {showTitle && <div className="font-bold opacity-80 text-center pb-4">Configure your Widget</div>}

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
                        setEvent(value as string);
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
                        setSize(value as DashboardItemSize);
                    }}
                    label={"Size"}
                    name={"size"}
                />

                <DropDownSelectFieldBox
                    value={type}
                    options={typesOptions}
                    setValue={(value) => {
                        setType(value as DashboardItemType);
                    }}
                    label={"Type"}
                    name={"type"}
                />

                {type === "parameter" &&
                    selectedTrigger?.configuration.fields.parameters !== undefined &&
                    selectedTrigger?.configuration.fields.parameters.length > 0 && (
                        <DropDownSelectFieldBox
                            value={parameter}
                            options={parameters.map((parameter) => ({
                                value: parameter,
                                label: mapParameterName(parameter),
                            }))}
                            setValue={(value) => {
                                setParameter(value as string);
                            }}
                            label={"Parameter"}
                            name={"parameter"}
                        />
                    )}

                <PrimaryButton text={submitButtonLabel} onClick={handleSubmitWidgetForm} />
            </div>
        </>
    );
}
