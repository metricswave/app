import {Cross1Icon, Pencil1Icon} from "@radix-ui/react-icons"
import {TriggerStats} from "../triggers/TriggerStats"
import {TriggerParamsStats} from "../triggers/TriggerParamsStats"
import React, {useState} from "react"
import {useTriggersState} from "../../storage/Triggers"
import {PeriodConfiguration} from "../../types/Period"
import {EditWidget} from "./EditWidget"
import {DashboardItem, DashboardItemType} from "../../storage/Dashboard"
import DeleteButton from "../form/DeleteButton"
import {TriggerFunnelStats} from "../triggers/TriggerFunnelStats"
import {app} from "../../config/app"

type Props = {
    eventUuid: string,
    title: string,
    size: "base" | "large",
    type: DashboardItemType,
    parameter?: string,
    period: PeriodConfiguration,
    compareWithPrevious: boolean,
    date: string,
    removeWidget: () => void,
    editWidget: (item: DashboardItem) => void,
    moveWidgetUp: () => void,
    canMoveUp: boolean,
    moveWidgetDown: () => void,
    canMoveDown: boolean,
}

export default function DashboardWidget(
    {
        eventUuid,
        title,
        size,
        type,
        parameter,
        period,
        compareWithPrevious,
        date,
        removeWidget,
        editWidget,
        moveWidgetUp,
        canMoveUp,
        moveWidgetDown,
        canMoveDown,
    }: Props,
) {
    const [view, setView] = useState<"editing" | "viewing">("viewing")
    const {triggerByUuid} = useTriggersState()
    const trigger = triggerByUuid(eventUuid)

    if (trigger === undefined) {
        return null
    }

    return (
        <div
            className={[
                "relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow",
                (size === "base" ? "" : "md:col-span-2"),
                !app.isProduction && `event-${eventUuid} type-${type} size-${size} parameter-${parameter}`,
            ].join(" ")}
        >
            {view === "viewing" && <div
                title={"Edit widget"}
                className={[
                    "absolute right-4 top-4 rounded-sm cursor-pointer opacity-0 group-hover:opacity-25 text-lg group-hover:hover:opacity-100 group-hover:hover:text-blue-500 smooth-all p-3 dark:group-hover:bg-zinc-700 dark:group-hover:text-blue-50",
                ].join(" ")}
                onClick={() => setView("editing")}
            >
                <Pencil1Icon className="w-4 h-4"/>
            </div>}
            {view === "editing" && <div
                title={"Stop editing widget"}
                className={[
                    "absolute right-4 top-4 rounded-sm cursor-pointer opacity-0 group-hover:opacity-25 text-lg group-hover:hover:opacity-100 group-hover:hover:text-blue-500 smooth-all p-3 dark:group-hover:bg-zinc-700 dark:group-hover:text-blue-50",
                ].join(" ")}
                onClick={() => setView("viewing")}
            >
                <Cross1Icon className="w-4 h-4"/>
            </div>}

            {view === "editing" &&
                <div className="flex flex-col items-center p-6 gap-4">
                    <EditWidget
                        eventUuid={eventUuid}
                        eventTitle={title}
                        eventSize={size}
                        eventType={type}
                        closeWidgetForm={() => setView("viewing")}
                        editWidget={editWidget}
                        moveWidgetUp={moveWidgetUp}
                        canMoveUp={canMoveUp}
                        moveWidgetDown={moveWidgetDown}
                        canMoveDown={canMoveDown}
                    />

                    <div className={"w-full max-w-[400px]"}>
                        <DeleteButton
                            onClick={async () => removeWidget()}
                            text={"Remove Widget"}
                            className="w-full"
                        />
                    </div>
                </div>
            }

            {view === "viewing" && <>
                {type === "funnel" && <TriggerFunnelStats
                    title={title}
                    trigger={trigger}
                    defaultPeriod={period.period}
                    defaultDate={date}
                    hideFilters
                    compareWithPrevious={compareWithPrevious}
                />}

                {type === "stats" &&
                    <TriggerStats
                        trigger={trigger}
                        title={title}
                        defaultPeriod={period.period}
                        defaultDate={date}
                        hideViewSwitcher
                        compareWithPrevious={compareWithPrevious}
                    />
                }

                {type === "parameter" &&
                    <TriggerParamsStats
                        trigger={trigger}
                        defaultParameter={parameter}
                        title={title}
                        defaultPeriod={period.period}
                        defaultDate={date}
                        compareWithPrevious={compareWithPrevious}
                        hideFilters
                    />
                }
            </>}
        </div>
    )
}
