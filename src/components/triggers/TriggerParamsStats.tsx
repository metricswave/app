import React, { useEffect, useState } from "react";
import { Trigger } from "../../types/Trigger";
import { ParamStatRow, useTriggerParamsStatsState } from "../../storage/TriggerParamsStats";
import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox";
import PageTitle from "../sections/PageTitle";
import { money_formatter, number_formatter } from "../../helpers/NumberFormatter";
import InputFieldBox from "../form/InputFieldBox";
import { calculateDefaultDateForPeriod, fieldTypeForPeriod, Period } from "../../types/Period";
import CircleArrowsIcon from "../icons/CircleArrowsIcon";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { percentage_of } from "../../helpers/PercentageOf";

type Props = {
    trigger: Trigger;
    title?: string;
    publicDashboard?: string | undefined;
    defaultParameter?: string;
    defaultPeriod?: Period;
    defaultDate?: string;
    defaultFromDate?: string;
    hideFilters?: boolean;
    hidePeriodFilter?: boolean;
    hideParameterChooser?: boolean;
    compareWithPrevious?: boolean;
};

export function TriggerParamsStats({
    trigger,
    title,
    defaultParameter,
    defaultDate,
    defaultFromDate = undefined,
    publicDashboard,
    defaultPeriod = "day",
    hideFilters = false,
    hidePeriodFilter = false,
    hideParameterChooser = false,
    compareWithPrevious = false,
}: Props) {
    const [params] = useState<string[]>(
        (trigger.configuration.fields["parameters"] as string[])
            .filter((param) => !(param === "amount" && trigger.configuration.type === 'money_income'))
    );
    const [parameter, setParameter] = useState<string>(defaultParameter ?? params[0]);
    const [period, setPeriod] = useState<Period>(defaultPeriod);
    const [date, setDate] = useState<string>(defaultDate ?? calculateDefaultDateForPeriod(period));

    const [fieldDate, setFieldDate] = useState<string>();
    const dateFieldType = fieldTypeForPeriod(period);
    const setPeriodAndDate = (period: Period) => {
        const date = calculateDefaultDateForPeriod(period);
        setDate(date);
        setFieldDate(fieldTypeForPeriod(period) === "month" ? date.slice(0, 7) : date);
        setPeriod(period);
    };
    const { stats, previousStats, loadStats, loadPreviousStats, statsLoading } = useTriggerParamsStatsState();

    const paramStats: ParamStatRow[] =
        stats !== undefined && stats.plot !== undefined && stats.plot[parameter] !== undefined
            ? Object.values(stats.plot[parameter])
            : [];
    const previousParamsStats: ParamStatRow[] | undefined =
        previousStats !== undefined && previousStats.plot !== undefined && previousStats.plot[parameter] !== undefined
            ? Object.values(previousStats.plot[parameter])
            : undefined;
    const totalScore = paramStats.reduce((acc, curr) => acc + curr.score, 0);
    const totalScoreString = trigger.configuration.type !== 'money_income' ? number_formatter(totalScore) : money_formatter(totalScore);

    useEffect(() => {
        setDate(fieldTypeForPeriod(period) === "month" ? fieldDate + "-01" : fieldDate!);
    }, [fieldDate]);
    useEffect(() => setPeriodAndDate(defaultPeriod), [defaultPeriod]);
    useEffect(() => setDate(defaultDate!), [defaultDate]);

    const param = hideFilters || hideParameterChooser ? (defaultParameter ?? params[0]) : null;

    useEffect(
        () => loadStats(trigger, period, date, publicDashboard, param, defaultFromDate),
        [trigger.id, period, date, publicDashboard, defaultFromDate],
    );
    useEffect(
        () =>
            compareWithPrevious === true
                ? loadPreviousStats(trigger, period, date, publicDashboard, param, defaultFromDate)
                : undefined,
        [trigger.id, compareWithPrevious, period, date, publicDashboard, defaultFromDate],
    );

    return (
        <div className="">
            <div className="pb-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                <PageTitle title={title ?? "Stats by Parameter"} description={`${totalScoreString} hits in period.`} />
            </div>

            {!hideFilters && (
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0justify-between pt-4 pb-10">
                    {!hidePeriodFilter && (
                        <div className="w-full sm:w-1/3">
                            <InputFieldBox
                                setValue={setFieldDate}
                                label="Date"
                                type={dateFieldType}
                                name="date"
                                placeholder={"Date"}
                                value={fieldDate as string}
                            />
                        </div>
                    )}

                    {(!hideParameterChooser || !hidePeriodFilter) && (
                        <div className="flex flex-col sm:flex-row flex-grow sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                            {!hideParameterChooser && (
                                <DropDownSelectFieldBox
                                    value={parameter}
                                    options={params.map((param) => ({ value: param, label: param }))}
                                    setValue={(value) => {
                                        setParameter(value as string);
                                    }}
                                    className="w-full sm:w-1/3"
                                    label="Parameter"
                                    name="parameter"
                                />
                            )}

                            {!hidePeriodFilter && (
                                <DropDownSelectFieldBox
                                    className="w-full sm:w-1/3"
                                    value={period}
                                    options={[
                                        {
                                            value: "day",
                                            label: "Daily",
                                        },
                                        {
                                            value: "month",
                                            label: "Monthly",
                                        },
                                    ]}
                                    setValue={(value) => {
                                        setPeriodAndDate(value as Period);
                                    }}
                                    label="Period"
                                    name="period"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}

            {statsLoading && (
                <div className="">
                    <div className="flex flex-col gap-4 items-center animate-pulse py-20 justify-center">
                        <CircleArrowsIcon className="animate-spin h-6" />
                        <div>Loading…</div>
                    </div>
                </div>
            )}

            {!statsLoading && (
                <>
                    {paramStats.length === 0 ? (
                        <div className="w-full flex items-center justify-center text-center h-64">
                            <div className="opacity-50">No stats for this period.</div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col space-y-2 py-3">
                                <div className="flex font-bold flex-row items-center justify-between space-x-3">
                                    <p>Parameter</p>
                                    <p>Hits</p>
                                </div>
                            </div>

                            {paramStats.slice(0, 8).map((stat, index) => {
                                const previousStatScore =
                                    previousParamsStats !== undefined
                                        ? (previousParamsStats.find((s) => s.param === stat.param)?.score ?? 0)
                                        : 0;
                                const percentageDifference = number_formatter(
                                    ((stat.score - previousStatScore) / previousStatScore) * 100,
                                    {
                                        maximumFractionDigits: 0,
                                    },
                                );

                                const formatedScore = trigger.configuration.type === 'money_income' ? money_formatter(stat.score) : number_formatter(stat.score);

                                return (
                                    <div key={index} className="flex flex-col space-y-2 py-3">
                                        <div className="flex flex-row items-start justify-between space-x-3">
                                            <p className="truncate opacity-75">{stat.param}</p>
                                            <p className="opacity-75">{formatedScore}</p>
                                        </div>

                                        <div className="flex flex-row gap-4 items-center justify-start">
                                            <div className="flex-grow flex flex-col gap-1.5">
                                                <div className="w-full flex flex-row gap-2">
                                                    {[0, 1, 2, 3].map((i) => {
                                                        const barPercentage =
                                                            percentage_of(totalScore, stat.score) - 23 * i;
                                                        const p = barPercentage < 1 ? 0 : Math.min(barPercentage, 23);

                                                        return (
                                                            <div
                                                                key={i}
                                                                className="h-1 rounded bg-blue-500"
                                                                style={{ width: `${p}%` }}
                                                            ></div>
                                                        );
                                                    })}
                                                </div>

                                                {compareWithPrevious && (
                                                    <div className="w-full flex flex-row gap-2">
                                                        {[0, 1, 2, 3].map((i) => {
                                                            const barPercentage =
                                                                percentage_of(totalScore, previousStatScore) - 23 * i;
                                                            const p =
                                                                barPercentage < 1 ? 0 : Math.min(barPercentage, 23);

                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="h-1 rounded bg-slate-500"
                                                                    style={{ width: `${p}%` }}
                                                                ></div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {compareWithPrevious && (
                                                <div className="flex flex-row gap-0.5 leading-4 items-center text-sm">
                                                    {stat.score >= previousStatScore ? (
                                                        <ArrowUpIcon className="h-3 text-green-500" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-3 text-red-500" />
                                                    )}
                                                    <span
                                                        className={[
                                                            stat.score >= previousStatScore
                                                                ? "text-green-500"
                                                                : "text-red-500",
                                                        ].join(" ")}
                                                    >
                                                        {percentageDifference}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
