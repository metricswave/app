import { Trigger } from "../types/Trigger";
import { useState } from "react";
import { ApiResponse, fetchApi, fetchAuthApi } from "../helpers/ApiFetcher";
import { Period, safeApiPeriod } from "../types/Period";
import { expirableLocalStorage, FIVE_SECONDS } from "../helpers/ExpirableLocalStorage";
import { getPreviousPeriodDate } from "./TriggerStats";
import { subDays } from "date-fns";
import format from "date-fns/format";

export type ParamsStats = { plot: { [key: string]: ParamStatRow[] } };

export type ParamStatRow = {
    score: number;
    param: string;
};

function parseDataForType(data: ParamsStats, type: string): ParamsStats
{
    if (type === "money_income") {
        data.plot["source"] = data.plot["source"]
            .map((row) => {
                const amount = row.score / 100
                return { ...row, score: amount }
            })
    }

    return data
}

export function useTriggerParamsStatsState() {
    const [statsLoading, setStatsLoading] = useState<boolean>(false);
    const [stats, setStats] = useState<ParamsStats | undefined>();
    const [previousStats, setPreviousStats] = useState<ParamsStats | undefined>();
    const [previousStatsLoading, setPreviousStatsLoading] = useState<boolean>(false);

    const setStatsFor = (stats: ParamsStats | undefined, current: boolean) => {
        if (current) {
            setStats(stats);
        } else {
            setPreviousStats(stats);
        }
    };
    const setLoadingFor = (loading: boolean, current: boolean) => {
        if (current) {
            setStatsLoading(loading);
        } else {
            setPreviousStatsLoading(loading);
        }
    };

    const loadStatsFor = (
        current: boolean,
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        parameter: string | null | undefined,
        fromDate: string | null | undefined = undefined,
    ) => {
        const key =
            `trigger-params-stats-v1-${current ? "current" : "previous"}` +
            `-${trigger.uuid}-${period}-${date ?? ""}-${publicDashboard ?? "private"}-${parameter ?? "all"}`;
        const query = new URLSearchParams({
            period: safeApiPeriod(period),
            ...(date ? { date } : {}),
            ...(fromDate ? { "from-date": fromDate } : {}),
        });
        const methods = {
            success: (data: ApiResponse<ParamsStats>) => {
                if (publicDashboard === undefined) {
                    expirableLocalStorage.set(key, data.data, FIVE_SECONDS);
                }

                const parsedData = parseDataForType(data.data, trigger.configuration.type);

                setStatsFor(parsedData, current);
                setLoadingFor(false, current);
            },
            error: () => {
                setStatsFor(undefined, current);
                setLoadingFor(false, current);
            },
            catcher: () => {
                setStatsFor(undefined, current);
                setLoadingFor(false, current);
            },
        };

        const cachedData = expirableLocalStorage.get(key, null);
        if (publicDashboard === undefined && cachedData !== null) {
            setStatsFor(cachedData, current);
            setLoadingFor(false, current);
            return;
        }

        setLoadingFor(true, current);

        if (publicDashboard !== undefined) {
            fetchApi<ParamsStats>(
                `/dashboards/${publicDashboard}/triggers/${trigger.uuid}/parameters-graph-stats/${parameter ?? ""}?` +
                    query,
                methods,
            );
        } else {
            fetchAuthApi<ParamsStats>(
                `/triggers/${trigger.uuid}/parameters-graph-stats/${parameter ?? ""}?` + query,
                methods,
            );
        }
    };

    const loadStats = (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        parameter: string | null | undefined = undefined,
        fromDate: string | null | undefined = undefined,
    ) => {
        loadStatsFor(true, trigger, period, date, publicDashboard, parameter, fromDate);
    };

    const loadPreviousStats = (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        parameter: string | null | undefined = undefined,
        fromDate: string | null | undefined = undefined,
    ) => {
        if (period === "c_daily") {
            const d = date ? new Date(date) : new Date();
            const fd = fromDate ? new Date(fromDate) : new Date();
            const daysBetween = Math.abs(d.getTime() - fd.getTime()) / (1000 * 60 * 60 * 24) + 1;
            const prevDate = format(subDays(d, daysBetween), "yyyy-MM-dd");
            const prevFromDate = format(subDays(fd, daysBetween), "yyyy-MM-dd");

            loadStatsFor(false, trigger, period, prevDate, publicDashboard, parameter, prevFromDate);
            return;
        }

        loadStatsFor(false, trigger, period, getPreviousPeriodDate(period, date), publicDashboard, parameter, fromDate);
    };

    return { stats, previousStats, loadStats, loadPreviousStats, statsLoading: statsLoading || previousStatsLoading };
}
