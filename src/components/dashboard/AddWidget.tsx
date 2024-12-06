import { useEffect, useState } from "react";
import { Trigger } from "../../types/Trigger";
import { useTriggersState } from "../../storage/Triggers";
import WidgetForm from "./WidgetForm";
import { Cross1Icon } from "@radix-ui/react-icons";
import { twMerge } from "../../helpers/TwMerge";
import { DashboardItem, DashboardItemSize, DashboardItemType } from "../../types/Dashboard";

type Props = {
    addButtonSize?: string;
    addWidgetToDashboard: (item: DashboardItem) => void;
    defaultStep?: Steps;
    className?: string;
    formClassName?: string;
};

type Steps = "idle" | "selecting";

export function AddWidget({
    addButtonSize = "w-full",
    addWidgetToDashboard,
    defaultStep,
    className,
    formClassName,
}: Props) {
    const { triggers, triggerByUuid } = useTriggersState();
    const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);

    const [step, setStep] = useState<Steps>(defaultStep ?? "idle");
    const [title, setTitle] = useState<string>("");
    const [event, setEvent] = useState<string>("");
    const [size, setSize] = useState<DashboardItemSize>("base");
    const [type, setType] = useState<DashboardItemType>("stats");
    const [parameter, setParameter] = useState<string>("");
    const [otherEvents, setOtherEvents] = useState<string[]>([]);

    useEffect(() => {
        if (event) {
            setSelectedTrigger(triggerByUuid(event)!);
        }
    }, [event]);

    useEffect(() => {
        if (step === "idle") {
            setTitle("");
            setEvent("");
            setSize("base");
            setType("stats");
            setParameter("");
        }
    }, [step]);

    const submitWidgetForm = () => {
        setStep("idle");
        addWidgetToDashboard({
            title,
            eventUuid: event,
            size,
            type,
            parameter,
            otherEvents: [], // TODO
        });
    };

    if (step === "idle") {
        return (
            <div className={`float-left ${addButtonSize}`} onClick={() => setStep("selecting")}>
                <div
                    className={twMerge(
                        "bg-white dark:bg-zinc-900 bg-opacity-25 rounded-sm p-14 border-2 border-dashed soft-border flex items-center justify-center smooth hover:cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 hover:bg-opacity-70 group",
                        className,
                    )}
                >
                    <div className="opacity-40 group-hover:opacity-70">Add Widget</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative float-left ${addButtonSize}`}>
            <div
                className={twMerge(
                    "absolute right-3 top-3 rounded-full cursor-pointer opacity-60 hover:opacity-90 smooth p-4",
                )}
                onClick={() => setStep("idle")}
            >
                <Cross1Icon />
            </div>

            <div
                className={twMerge(
                    "bg-white dark:bg-zinc-800 bg-opacity-70 rounded-sm p-6 sm:py-14 border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center smooth group",
                    formClassName,
                )}
            >
                <WidgetForm
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
                    otherEvents={otherEvents}
                    setOtherEvents={setOtherEvents}
                    submitWidgetForm={submitWidgetForm}
                />
            </div>
        </div>
    );
}
