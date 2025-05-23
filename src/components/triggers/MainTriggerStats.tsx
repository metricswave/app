import { Trigger } from "../../types/Trigger";
import { Stats, useTriggerStatsState } from "../../storage/TriggerStats";
import { useEffect, useState } from "react";
import { amount_from_cents, money_formatter, number_formatter } from "../../helpers/NumberFormatter";
import { calculateDefaultDateForPeriod, fieldTypeForPeriod, Period } from "../../types/Period";
import { TriggerStatsLoading } from "./TriggerStatsLoading";
import { format } from "date-fns";

function getGraphData(stats: Stats, previousPeriodStats: Stats, view: Period) {
    const data = stats.plot.map((stat, index) => ({
        name: stat.date,
        total: stat.score,
        previous: previousPeriodStats?.plot[index]?.score ?? 0,
        previousName: previousPeriodStats?.plot[index]?.date ?? "",
    }));

    data.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    return data;
}

type ChildrenFuction = (
    stats: (uuid: string) => Stats,
    previousPeriodStats: (uuid: string) => Stats,
    data: Data[] | undefined,
    fieldDate: string | undefined,
    setFieldDate: (date: string) => void,
    dateFieldType: "date" | "month",
    average: string,
) => JSX.Element;

type Props = {
    title: string;
    trigger: Trigger;
    otherTriggers?: Trigger[] | null;
    publicDashboard?: string | undefined;
    defaultPeriod: Period;
    defaultDate?: string;
    defaultFromDate?: string;
    hideViewSwitcher?: boolean;
    compareWithPrevious?: boolean;
    children: ChildrenFuction;
};

type Data = {
    name: string;
    total: number;
    previous: number;
    previousName: string;
    [key: string]: string | number;
};

export function MainTriggerStats({
    trigger,
    otherTriggers = null,
    publicDashboard,
    defaultPeriod,
    defaultDate,
    defaultFromDate = undefined,
    compareWithPrevious = false,
    children,
}: Props): JSX.Element {
    const [period, setPeriod] = useState<Period>(defaultPeriod);
    const { stats, previousPeriodStats, loadStats, loadPreviousPeriodStats, statsLoading } = useTriggerStatsState(
        trigger.uuid,
    );
    const [data, setData] = useState<Data[]>();
    const [average, setAverage] = useState("");
    const [date, setDate] = useState<string>(defaultDate ?? calculateDefaultDateForPeriod(period));
    const [fieldDate, setFieldDate] = useState<string>();
    const dateFieldType = fieldTypeForPeriod(period);
    const setPeriodAndDate = (period: Period) => {
        const date = calculateDefaultDateForPeriod(period);
        setDate(date);
        setFieldDate(fieldTypeForPeriod(period) === "month" ? date.slice(0, 7) : date);
        setPeriod(period);
    };

    useEffect(() => {
        setDate(fieldTypeForPeriod(period) === "month" ? fieldDate + "-01" : fieldDate!);
    }, [fieldDate]);
    useEffect(() => setPeriodAndDate(defaultPeriod), [defaultPeriod]);
    useEffect(() => setDate(defaultDate!), [defaultDate]);
    useEffect(() => {
        loadStats(trigger, period, date, publicDashboard, defaultFromDate);
    }, [trigger.id, period, date, publicDashboard, defaultFromDate]);

    useEffect(() => {
        otherTriggers?.forEach((t) => {
            loadStats(t, period, date, publicDashboard, defaultFromDate);
        });
    }, [...(otherTriggers ?? []).map((t) => t.id), period, date, publicDashboard, defaultFromDate]);

    useEffect(() => {
        return compareWithPrevious
            ? loadPreviousPeriodStats(trigger, period, date, publicDashboard, defaultFromDate)
            : undefined;
    }, [trigger.id, compareWithPrevious, period, date, publicDashboard, defaultFromDate]);

    useEffect(() => {
        return compareWithPrevious
            ? otherTriggers?.forEach((t) => {
                  loadPreviousPeriodStats(t, period, date, publicDashboard, defaultFromDate);
              })
            : undefined;
    }, [...(otherTriggers ?? []).map((t) => t.id), period, date, publicDashboard, defaultFromDate]);

    useEffect(() => {
        let data = getGraphData(stats(trigger.uuid), previousPeriodStats(trigger.uuid), period);
        data = data.map((d) => ({
            ...d,
            total: trigger.configuration.type === "money_income" ? amount_from_cents(d.total) : d.total,
            previous: trigger.configuration.type === "money_income" ? amount_from_cents(d.previous) : d.previous,
        }));

        otherTriggers?.forEach((t) => {
            const d = getGraphData(stats(t.uuid), previousPeriodStats(t.uuid), period);
            data = mergeData(data, d, t);
        });

        const average = data.reduce((acc, curr) => acc + curr.total, 0) / data.length;
        setData(data);
        setAverage(
            isNaN(average)
                ? "0"
                : trigger.configuration.type === "money_income"
                  ? money_formatter(average)
                  : number_formatter(average),
        );
    }, [
        stats(trigger.uuid).plot.length,
        previousPeriodStats(trigger.uuid).plot.length,
        period,
        ...(otherTriggers ?? []).map((t) => stats(t.uuid).plot.length),
        ...(otherTriggers ?? []).map((t) => previousPeriodStats(t.uuid).plot.length),
    ]);

    if (statsLoading) {
        return <TriggerStatsLoading />;
    }

    return children(stats, previousPeriodStats, data, fieldDate, setFieldDate, dateFieldType, average);
}

function mergeData(data: Data[], d: Data[], trigger: Trigger): Data[] {
    return data.map((item) => {
        const i = d.find((d) => format(new Date(d.name), "yyyyLLdd") === format(new Date(item.name), "yyyyLLdd"));

        return {
            ...item,
            ...(i !== undefined
                ? {
                      [`name_${trigger.id}`]: i.name,
                      [`total_${trigger.id}`]:
                          trigger.configuration.type === "money_income" ? amount_from_cents(i.total) : i.total,
                      [`previousName_${trigger.id}`]: i.previousName,
                      [`previous_${trigger.id}`]:
                          trigger.configuration.type === "money_income" ? amount_from_cents(i.previous) : i.previous,
                  }
                : {}),
        };
    });
}
