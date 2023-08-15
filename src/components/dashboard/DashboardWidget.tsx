import {TriggerStats} from "../triggers/TriggerStats"
import {TriggerParamsStats} from "../triggers/TriggerParamsStats"
import React from "react"
import {useTriggersState} from "../../storage/Triggers"
import {PeriodConfiguration} from "../../types/Period"
import {DashboardItemType} from "../../storage/Dashboard"
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
    }: Props,
) {
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
        </div>
    )
}
