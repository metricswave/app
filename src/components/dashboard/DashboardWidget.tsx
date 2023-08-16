import {TriggerStats} from "../triggers/TriggerStats"
import {TriggerParamsStats} from "../triggers/TriggerParamsStats"
import React from "react"
import {useTriggersState} from "../../storage/Triggers"
import {PeriodConfiguration} from "../../types/Period"
import {DashboardItemType} from "../../storage/Dashboard"
import {app} from "../../config/app"
import {TriggerFunnelStats} from "../triggers/TriggerFunnelStats"
import {Trigger} from "../../types/Trigger"

type Props = {
    title: string,
    size: "base" | "large",
    type: DashboardItemType,
    parameter?: string,
    period: PeriodConfiguration,
    compareWithPrevious: boolean,
    date: string,
    eventUuid?: string,
    trigger?: Trigger
    publicDashboard?: string | undefined,
}

export default function DashboardWidget(
    {
        title,
        size,
        type,
        parameter,
        period,
        compareWithPrevious,
        date,
        eventUuid = undefined,
        trigger = undefined,
        publicDashboard = undefined,
    }: Props,
) {
    const {triggerByUuid} = useTriggersState()

    if (trigger === undefined && eventUuid !== undefined) {
        trigger = triggerByUuid(eventUuid)
    }

    if (trigger === undefined && eventUuid === undefined) {
        return null
    }

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
                publicDashboard={publicDashboard}
                compareWithPrevious={compareWithPrevious}
            />}

            {type === "stats" &&
                <TriggerStats
                    trigger={trigger}
                    title={title}
                    defaultPeriod={period.period}
                    defaultDate={date}
                    hideViewSwitcher
                    publicDashboard={publicDashboard}
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
                    publicDashboard={publicDashboard}
                    compareWithPrevious={compareWithPrevious}
                    hideFilters
                />
            }
        </div>
    )
}
