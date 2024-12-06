import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money_formatter, number_formatter } from "../../helpers/NumberFormatter";
import { percentage_diff } from "../../helpers/PercentageOf";
import { Period } from "../../types/Period";
import { Trigger } from "../../types/Trigger";
import InputFieldBox from "../form/InputFieldBox";
import PageTitle from "../sections/PageTitle";
import { MainTriggerStats } from "./MainTriggerStats";

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
};

export function TriggerStats({
    title,
    trigger,
    otherTriggers = null,
    publicDashboard,
    defaultPeriod,
    defaultDate,
    defaultFromDate = undefined,
    hideViewSwitcher = false,
    compareWithPrevious = false,
}: Props) {
    return (
        <MainTriggerStats
            title={title}
            trigger={trigger}
            otherTriggers={otherTriggers}
            publicDashboard={publicDashboard}
            defaultPeriod={defaultPeriod}
            defaultDate={defaultDate}
            defaultFromDate={defaultFromDate}
            hideViewSwitcher={hideViewSwitcher}
            compareWithPrevious={compareWithPrevious}
            children={(stats, previousPeriodStats, data, fieldDate, setFieldDate, dateFieldType, average) => {
                const statsData = stats(trigger.uuid);
                const previousData = previousPeriodStats(trigger.uuid);

                console.log({ data });

                return (
                    <>
                        <div className="h-full flex flex-col justify-between">
                            <div className="pb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                                {title !== undefined && (
                                    <PageTitle title={title} description={`${average} average hits in period.`} />
                                )}
                                {!hideViewSwitcher && (
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
                            </div>

                            {statsData.headers !== null && (
                                <div className="flex flex-col sm:flex-row justify-start sm:items-center mb-10">
                                    {Object.values(statsData.headers).map((header, index) => {
                                        const key = Object.keys(statsData.headers!)[index] as
                                            | "unique"
                                            | "pageViews"
                                            | "visits"
                                            | "total_income";
                                        const previousStatsHeaders = previousData?.headers
                                            ? (previousData?.headers[key] as number)
                                            : 0;
                                        const percentageDifference = percentage_diff(header, previousStatsHeaders);
                                        const formattedHeader =
                                            key === "total_income" ? money_formatter(header) : number_formatter(header);

                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col text-right justify-between items-start gap-1 sm:border-r soft-border py-2 sm:py-0 sm:px-14 first:pl-0 last:pr-0 last:border-none"
                                            >
                                                <div className="flex items-start justify-center gap-3">
                                                    <div className="text-sm text-gray-400 dark:text-gray-600">
                                                        {
                                                            {
                                                                unique: "Unique visits",
                                                                pageViews: "Page views",
                                                                visits: "Visits",
                                                                total_income: "Total income",
                                                            }[Object.keys(statsData.headers!)[index]]
                                                        }
                                                    </div>
                                                </div>

                                                <div className="text-2xl font-medium">{formattedHeader}</div>

                                                {compareWithPrevious && (
                                                    <div className="flex flex-row justify-start gap-2 items-baseline">
                                                        <div className="text-2xl font-medium opacity-50">
                                                            {number_formatter(previousStatsHeaders)}
                                                        </div>
                                                        {compareWithPrevious && (
                                                            <div className="flex items-start gap-0.5">
                                                                {percentageDifference > 0 ? (
                                                                    <ArrowUpIcon className="h-4 text-green-500" />
                                                                ) : (
                                                                    <ArrowDownIcon className="h-4 text-red-500" />
                                                                )}
                                                                <div className="text-sm text-gray-400 dark:text-gray-600">
                                                                    {number_formatter(percentageDifference)}%
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={data}>
                                    <Tooltip
                                        cursor={{ fill: "#ffffff", opacity: "0.05" }}
                                        content={({ payload, label }) => {
                                            const date = new Date((payload?.[0]?.payload?.name ?? "") as string);
                                            const formattedDate = date.toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            });

                                            const score = (payload?.[0]?.value ?? 0) as number;

                                            let scoreString = number_formatter(score, { maximumFractionDigits: 0 });
                                            if (trigger.configuration.type === "money_income") {
                                                scoreString = money_formatter(score);
                                            }

                                            if (compareWithPrevious) {
                                                const previousDate = new Date(
                                                    (payload?.[1]?.payload?.previousName ?? "") as string,
                                                );
                                                const formattedPreciousDate = previousDate.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                    },
                                                );

                                                const previousScore = (payload?.[1]?.value ?? 0) as number;
                                                const previousScoreString = number_formatter(previousScore, {
                                                    maximumFractionDigits: 0,
                                                });

                                                const diffPercentage = ((score - previousScore) / previousScore) * 100;

                                                return (
                                                    <>
                                                        <div className="bg-white dark:bg-zinc-900 p-2 shadow rounded-sm text-sm">
                                                            <p className="flex flex-row justify-between gap-2">
                                                                <span className="opacity-75">{formattedDate}</span>
                                                                <span className="font-bold min-w-[60px] text-right">
                                                                    {scoreString}
                                                                </span>
                                                            </p>
                                                            <p className="flex flex-row justify-between gap-2">
                                                                <span className="opacity-75">
                                                                    {formattedPreciousDate}
                                                                </span>
                                                                <span className="font-bold min-w-[60px] text-right">
                                                                    {previousScoreString}
                                                                </span>
                                                            </p>
                                                            <p className="flex flex-row justify-between gap-2">
                                                                <span></span>
                                                                <div className="flex flex-row gap-0.5 justify-end items-center font-bold min-w-[60px] text-right">
                                                                    {diffPercentage >= 0 && (
                                                                        <ArrowUpIcon className="text-green-500" />
                                                                    )}
                                                                    {diffPercentage < 0 && (
                                                                        <ArrowDownIcon className="text-red-500" />
                                                                    )}
                                                                    {number_formatter(diffPercentage, {
                                                                        maximumFractionDigits: 0,
                                                                    })}
                                                                    %
                                                                </div>
                                                            </p>
                                                        </div>
                                                    </>
                                                );
                                            }

                                            return (
                                                <>
                                                    <div className="bg-white dark:bg-zinc-900 p-2 shadow rounded-sm text-sm">
                                                        <p>
                                                            <span className="opacity-75">{formattedDate}:</span>
                                                            <span className="font-bold">{scoreString}</span>
                                                        </p>
                                                    </div>
                                                </>
                                            );
                                        }}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        }}
                                    />
                                    <YAxis
                                        dataKey="total"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            if (trigger.configuration.type === "money_income") {
                                                return money_formatter(value);
                                            }

                                            return number_formatter(value);
                                        }}
                                    />
                                    <defs>
                                        <linearGradient
                                            id="colorCurrent"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="100%"
                                            color={"transparent"}
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop offset="0" stopColor="#3b82f6" stopOpacity={0.99} />
                                            <stop offset=".7" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorPrevious"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="100%"
                                            color={"transparent"}
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop offset="0" stopColor="#78716c" stopOpacity={0.99} />
                                            <stop offset=".7" stopColor="#78716c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type={"step"} dataKey="total" stroke="#3b82f6" fill="url(#colorCurrent)" />
                                    {compareWithPrevious && (
                                        <Area
                                            type={"step"}
                                            dataKey="previous"
                                            stroke="#78716c"
                                            fill="url(#colorPrevious)"
                                        />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                );
            }}
        />
    );
}
