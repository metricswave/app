import { TriggerStats } from "../triggers/TriggerStats";
import { TriggerParamsStats } from "../triggers/TriggerParamsStats";
import React from "react";
import { PeriodConfiguration } from "../../types/Period";
import { app } from "../../config/app";
import { TriggerFunnelStats } from "../triggers/TriggerFunnelStats";
import { Trigger } from "../../types/Trigger";
import { DashboardItemType } from "../../types/Dashboard";
import { twMerge } from "../../helpers/TwMerge";
import { TriggerNumberStats } from "../triggers/TriggerNumberStats";

type Props = {
    title: string;
    size: "base" | "large";
    type: DashboardItemType;
    parameter?: string;
    period: PeriodConfiguration;
    compareWithPrevious: boolean;
    date: string;
    fromDate?: string | undefined;
    trigger: Trigger;
    publicDashboard?: string | undefined;
};

export default function DashboardWidget({
    title,
    size,
    type,
    parameter,
    period,
    compareWithPrevious,
    date,
    fromDate = undefined,
    trigger,
    publicDashboard = undefined,
}: Props) {
    const eventUuid = trigger.uuid;

    return (
        <div
            className={twMerge(
                "relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow",
                size === "base" ? "" : "md:col-span-2",
                !app.isProduction ? `event-${eventUuid} type-${type} size-${size} parameter-${parameter}` : "",
            )}
        >
            {type === "funnel" && (
                <TriggerFunnelStats
                    title={title}
                    trigger={trigger}
                    defaultPeriod={period.period}
                    defaultDate={date}
                    defaultFromDate={fromDate}
                    hideFilters
                    publicDashboard={publicDashboard}
                    compareWithPrevious={compareWithPrevious}
                    size={size}
                />
            )}

            {type === "stats" && (
                <TriggerStats
                    trigger={trigger}
                    title={title}
                    defaultPeriod={period.period}
                    defaultDate={date}
                    defaultFromDate={fromDate}
                    hideViewSwitcher
                    publicDashboard={publicDashboard}
                    compareWithPrevious={compareWithPrevious}
                />
            )}

            {type === "number" && (
                <TriggerNumberStats
                    trigger={trigger}
                    title={title}
                    defaultPeriod={period.period}
                    defaultDate={date}
                    defaultFromDate={fromDate}
                    hideViewSwitcher
                    publicDashboard={publicDashboard}
                    compareWithPrevious={compareWithPrevious}
                />
            )}

            {type === "parameter" && (
                <TriggerParamsStats
                    trigger={trigger}
                    defaultParameter={parameter}
                    title={title}
                    defaultPeriod={period.period}
                    defaultDate={date}
                    defaultFromDate={fromDate}
                    publicDashboard={publicDashboard}
                    compareWithPrevious={compareWithPrevious}
                    hideFilters
                />
            )}
        </div>
    );
}
