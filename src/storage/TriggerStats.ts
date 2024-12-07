import { Trigger } from "../types/Trigger";
import { useState } from "react";
import { Period, safeApiPeriod } from "../types/Period";
import { expirableLocalStorage, FIVE_SECONDS } from "../helpers/ExpirableLocalStorage";
import { ApiResponse, fetchApi, fetchAuthApi } from "../helpers/ApiFetcher";
import { subDays, subMonths, subYears } from "date-fns";
import format from "date-fns/format";

export type Stats = StatsData & {
    triggerUuid: string;
};

type StatsData = {
    headers: null | { unique?: number; pageViews?: number; visits?: number; total_income?: number };
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

function parseDataForType(data: StatsData, type: string): StatsData {
    if (type === "money_income") {
        data.plot = data.plot.map((row) => {
            return { ...row, score: row.score };
        });
    }

    return data;
}

type StatsState = {
    stats: (uuid: string) => Stats;
    previousPeriodStats: (uuid: string) => Stats;
    loadStats: (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        fromDate: string | undefined,
    ) => void;
    loadPreviousPeriodStats: (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        fromDate: string | undefined,
    ) => void;
    statsLoading: boolean;
};

export function useTriggerStatsState(uuid: string = ""): StatsState {
    const defaultState: StatsData = { headers: null, plot: [] };
    const stateFor = (uuid: string, state: StatsData = defaultState): Stats => {
        return { ...state, triggerUuid: uuid };
    };
    const [stats, setStats] = useState<Stats[]>([stateFor(uuid)]);
    const [previousPeriodStats, setPreviousPeriodStats] = useState<Stats[]>([stateFor(uuid)]);
    const [statsLoading, setStatsLoading] = useState<boolean>(false);
    const [previousStatsLoading, setPreviousStatsLoading] = useState<boolean>(false);

    const updateOrSetStats = (newStats: Stats, current: boolean) => {
        const value: Stats[] = current ? stats : previousPeriodStats;
        const index = value.findIndex((s) => s.triggerUuid === newStats.triggerUuid);

        if (index !== -1) {
            value[index] = newStats;
        } else {
            value.push(newStats);
        }

        current ? setStats([...value]) : setPreviousPeriodStats([...value]);
    };

    const loadStatsFor = (
        current: boolean,
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
        fromDate: string | undefined,
    ) => {
        const key = `trigger-graph-stats-v2-${trigger.uuid}-${period}-${date ?? ""}-${fromDate ?? ""}`;

        if (publicDashboard === undefined) {
            let value = expirableLocalStorage.get(key, stateFor(trigger.uuid));

            if (Array.isArray(value)) {
                current ? setStats(value) : setPreviousPeriodStats(value);
            }
        }

        current ? setStatsLoading(true) : setPreviousStatsLoading(true);

        const methods = {
            success: (data: ApiResponse<StatsData>) => {
                const parsedData = stateFor(trigger.uuid, parseDataForType(data.data, trigger.configuration.type));

                if (publicDashboard === undefined) {
                    expirableLocalStorage.set(key, parsedData, FIVE_SECONDS);
                }

                updateOrSetStats(parsedData, current);
                current ? setStatsLoading(false) : setPreviousStatsLoading(false);
            },
            error: () => {
                const state = stateFor(trigger.uuid);
                updateOrSetStats(state, current);
                current ? setStatsLoading(false) : setPreviousStatsLoading(false);
            },
            catcher: () => {
                const state = stateFor(trigger.uuid);
                updateOrSetStats(state, current);
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
        stats: (uuid: string) => {
            return stats.find((s) => s.triggerUuid === uuid) ?? stateFor(uuid);
        },
        previousPeriodStats: (uuid: string) =>
            previousPeriodStats.find((s) => s.triggerUuid === uuid) ?? stateFor(uuid),
        loadStats,
        loadPreviousPeriodStats,
        statsLoading: statsLoading || previousStatsLoading,
    };
}
