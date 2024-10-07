import { Trigger } from "../types/Trigger";
import { useState } from "react";
import { Period, safeApiPeriod } from "../types/Period";
import { expirableLocalStorage, FIVE_SECONDS } from "../helpers/ExpirableLocalStorage";
import { ApiResponse, fetchApi, fetchAuthApi } from "../helpers/ApiFetcher";
import { subDays, subMonths, subYears } from "date-fns";
import format from "date-fns/format";

export type Stats = {
    headers: null | { unique?: number; pageViews?: number; visits?: number, total_income?: number };
    plot: StatRow[];
};

type StatRow = {
    date: string;
    score: number;
};

export const getPreviousPeriodDateObject = (period: Period, date: string | null): Date => {
    let previousDate = date ? new Date(date) : new Date();
    switch (period) {
        case "day":
            previousDate = subDays(previousDate, 1);
            break;
        case "7d":
            previousDate = subDays(previousDate, 7);
            break;
        case "30d":
            previousDate = subDays(previousDate, 30);
            break;
        case "month":
            previousDate = subMonths(previousDate, 1);
            break;
        case "year":
            previousDate = subYears(previousDate, 1);
            break;
        case "12m":
            previousDate = subMonths(previousDate, 12);
            break;
    }
    return previousDate;
};

export const getPreviousPeriodDate = (period: Period, date: string | null): string => {
    return format(getPreviousPeriodDateObject(period, date), "yyyy-MM-dd");
};

function parseDataForType(data: Stats, type: string): Stats
{
    if (type === "money_income") {
        data.plot = data.plot.map((row) => {
            return { ...row, score: row.score }
        })
    }

    return data
}

export function useTriggerStatsState() {
    const defaultState = { headers: null, plot: [] };
    const [stats, setStats] = useState<Stats>(defaultState);
    const [previousPeriodStats, setPreviousPeriodStats] = useState<Stats>(defaultState);
    const [statsLoading, setStatsLoading] = useState<boolean>(false);
    const [previousStatsLoading, setPreviousStatsLoading] = useState<boolean>(false);

    const loadStatsFor = (
        current: boolean,
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        fromDate: string | undefined,
    ) => {
        const key = `trigger-graph-stats-${trigger.uuid}-${period}-${date ?? ""}-${fromDate ?? ""}`;

        if (publicDashboard === undefined) {
            current
                ? setStats(expirableLocalStorage.get(key, defaultState))
                : setPreviousPeriodStats(expirableLocalStorage.get(key, defaultState));
        }

        current ? setStatsLoading(true) : setPreviousStatsLoading(true);

        const methods = {
            success: (data: ApiResponse<Stats>) => {
                if (publicDashboard === undefined) {
                    expirableLocalStorage.set(key, data.data, FIVE_SECONDS);
                }

                const parsedData = parseDataForType(data.data, trigger.configuration.type);

                current ? setStats(parsedData) : setPreviousPeriodStats(parsedData);
                current ? setStatsLoading(false) : setPreviousStatsLoading(false);
            },
            error: () => {
                current ? setStats(defaultState) : setPreviousPeriodStats(defaultState);
                current ? setStatsLoading(false) : setPreviousStatsLoading(false);
            },
            catcher: () => {
                current ? setStats(defaultState) : setPreviousPeriodStats(defaultState);
                current ? setStatsLoading(false) : setPreviousStatsLoading(false);
            },
        };

        if (publicDashboard === undefined && expirableLocalStorage.get(key, null) !== null) {
            current ? setStatsLoading(false) : setPreviousStatsLoading(false);
            return;
        }

        const params = new URLSearchParams({
            period: safeApiPeriod(period),
            ...(date ? { date } : {}),
            ...(fromDate ? { "from-date": fromDate } : {}),
        }).toString();

        if (publicDashboard !== undefined) {
            fetchApi<Stats>(`/dashboards/${publicDashboard}/triggers/${trigger.uuid}/graph-stats?` + params, methods);
            return;
        }

        fetchAuthApi<Stats>(`/triggers/${trigger.uuid}/graph-stats?` + params, methods);
    };

    const loadStats = (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        fromDate: string | undefined,
    ) => {
        loadStatsFor(true, trigger, period, date, publicDashboard, fromDate);
    };

    const loadPreviousPeriodStats = (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        fromDate: string | undefined,
    ) => {
        if (period === "c_daily") {
            const d = date ? new Date(date) : new Date();
            const fd = fromDate ? new Date(fromDate) : new Date();
            const daysBetween = Math.abs(d.getTime() - fd.getTime()) / (1000 * 60 * 60 * 24) + 1;
            const prevDate = format(subDays(d, daysBetween), "yyyy-MM-dd");
            const prevFromDate = format(subDays(fd, daysBetween), "yyyy-MM-dd");

            loadStatsFor(false, trigger, period, prevDate, publicDashboard, prevFromDate);
            return;
        }

        loadStatsFor(false, trigger, period, getPreviousPeriodDate(period, date), publicDashboard, fromDate);
    };

    return {
        stats,
        previousPeriodStats,
        loadStats,
        loadPreviousPeriodStats,
        statsLoading: statsLoading || previousStatsLoading,
    };
}
