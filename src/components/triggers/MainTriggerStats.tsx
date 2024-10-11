import PageTitle from "../sections/PageTitle";
import { Trigger } from "../../types/Trigger";
import { Stats, useTriggerStatsState } from "../../storage/TriggerStats";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { money_formatter, number_formatter } from "../../helpers/NumberFormatter";
import { calculateDefaultDateForPeriod, fieldTypeForPeriod, Period } from "../../types/Period";
import InputFieldBox from "../form/InputFieldBox";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { TriggerStatsLoading } from "./TriggerStatsLoading";
import { percentage_diff } from "../../helpers/PercentageOf";

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
    stats: Stats,
    previousPeriodStats: Stats,
    data: {name: string, total: number}[] | undefined,
    fieldDate: string | undefined,
    setFieldDate: (date: string) => void,
    dateFieldType: 'date' | 'month',
    average: string,
    ) => JSX.Element;

type Props = {
    title: string;
    trigger: Trigger;
    publicDashboard?: string | undefined;
    defaultPeriod: Period;
    defaultDate?: string;
    defaultFromDate?: string;
    hideViewSwitcher?: boolean;
    compareWithPrevious?: boolean;
    children: ChildrenFuction;
};

export function MainTriggerStats({
    trigger,
    publicDashboard,
    defaultPeriod,
    defaultDate,
    defaultFromDate = undefined,
    compareWithPrevious = false,
    children,
}: Props): JSX.Element {
    const [period, setPeriod] = useState<Period>(defaultPeriod);
    const { stats, previousPeriodStats, loadStats, loadPreviousPeriodStats, statsLoading } = useTriggerStatsState();
    const [data, setData] = useState<{ name: string; total: number }[]>();
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
    useEffect(
        () => loadStats(trigger, period, date, publicDashboard, defaultFromDate),
        [trigger.id, period, date, publicDashboard, defaultFromDate],
    );
    useEffect(
        () =>
            compareWithPrevious
                ? loadPreviousPeriodStats(trigger, period, date, publicDashboard, defaultFromDate)
                : undefined,
        [trigger.id, compareWithPrevious, period, date, publicDashboard, defaultFromDate],
    );
    useEffect(() => {
        const data = getGraphData(stats, previousPeriodStats, period);
        const average = data.reduce((acc, curr) => acc + curr.total, 0) / data.length;
        setData(data);
        setAverage(isNaN(average) ? "0" : (trigger.configuration.type === 'money_income' ? money_formatter(average) : number_formatter(average)));
    }, [stats, previousPeriodStats, period]);

    if (statsLoading) {
        return <TriggerStatsLoading />;
    }

    return children(stats, previousPeriodStats, data, fieldDate, setFieldDate, dateFieldType, average);
}
