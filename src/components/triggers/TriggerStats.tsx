import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Fragment } from "react";
import { Area, AreaChart, Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
    amount_from_cents,
    long_number_formatter,
    money_formatter,
    number_formatter,
} from "../../helpers/NumberFormatter";
import { percentage_diff } from "../../helpers/PercentageOf";
import { Period } from "../../types/Period";
import { Trigger } from "../../types/Trigger";
import InputFieldBox from "../form/InputFieldBox";
import PageTitle from "../sections/PageTitle";
import { MainTriggerStats } from "./MainTriggerStats";

const MAIN_COLOR = "#3b82f6";
const COLORS = ["#ec4899", "#22c55e", "#f97316", "#ef4444", "#a855f7"];
const PREVIOUS_MAIN_COLOR = "#93c5fd";
const PREVIOUS_COLORS = ["#f9a8d4", "#86efac", "#fdba74", "#ef4444", "#a855f7"];

const getColor = (i: number, previous: boolean = false): string => {
    if (previous) {
        return PREVIOUS_COLORS[i % PREVIOUS_COLORS.length];
    }

    return COLORS[i % COLORS.length];
};

type CHAR_TYPES =
    | "basis"
    | "basisClosed"
    | "basisOpen"
    | "bumpX"
    | "bumpY"
    | "bump"
    | "linear"
    | "linearClosed"
    | "natural"
    | "monotoneX"
    | "monotoneY"
    | "monotone"
    | "step"
    | "stepBefore"
    | "stepAfter";

const graphType = (type: string): CHAR_TYPES => {
    return type === "visits" ? "bump" : "step";
};

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

                const statsDataMaxValue = Math.max(...statsData.plot.map((c) => c.score));
                const previousStasDataMaxValue = Math.max(...previousData.plot.map((c) => c.score));

                const maxYAxisValue = Math.max(
                    ...[trigger, ...(otherTriggers ?? [])]
                        .map((t) => [
                            ...stats(t.uuid).plot.map((c) =>
                                t.configuration.type === "money_income" ? amount_from_cents(c.score) : c.score,
                            ),
                            ...previousPeriodStats(t.uuid).plot.map((c) =>
                                t.configuration.type === "money_income" ? amount_from_cents(c.score) : c.score,
                            ),
                        ])
                        .flat(),
                );

                const yAxisKey = statsDataMaxValue > previousStasDataMaxValue ? "total" : "previous";

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
                                <ComposedChart data={data}>
                                    <Tooltip
                                        cursor={{ fill: "#ffffff", opacity: "0.05" }}
                                        content={({ payload, label }) => {
                                            const date = new Date((label ?? "") as string);
                                            const formattedDate = date.toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            });

                                            const previousDate = new Date(
                                                (payload?.[0]?.payload.previousName ?? "") as string,
                                            );
                                            const previousFormattedDate = previousDate.toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            });

                                            const items: {
                                                name: string;
                                                score: string;
                                                previous?: true | undefined;
                                            }[] = [];

                                            // Main trigger number
                                            const score = (payload?.[0]?.payload.total ?? 0) as number;
                                            let scoreString = number_formatter(score, { maximumFractionDigits: 0 });
                                            if (trigger.configuration.type === "money_income") {
                                                scoreString = money_formatter(score * 100);
                                            }
                                            items.push({ name: trigger.title, score: scoreString });

                                            if (compareWithPrevious) {
                                                const score = (payload?.[0]?.payload.previous ?? 0) as number;
                                                let scoreString =
                                                    trigger.configuration.type !== "money_income"
                                                        ? number_formatter(score, { maximumFractionDigits: 0 })
                                                        : money_formatter(score * 100);
                                                items.push({ name: "↳", score: scoreString, previous: true });
                                            }

                                            otherTriggers?.forEach((t) => {
                                                const score = (payload?.[0]?.payload[`total_${t.id}`] ?? 0) as number;
                                                let scoreString =
                                                    t.configuration.type !== "money_income"
                                                        ? number_formatter(score, { maximumFractionDigits: 0 })
                                                        : money_formatter(score * 100);
                                                items.push({ name: t.title, score: scoreString });

                                                if (compareWithPrevious) {
                                                    const score = (payload?.[0]?.payload[`previous_${t.id}`] ??
                                                        0) as number;
                                                    let scoreString =
                                                        t.configuration.type !== "money_income"
                                                            ? number_formatter(score, { maximumFractionDigits: 0 })
                                                            : money_formatter(score * 100);
                                                    items.push({ name: "↳", score: scoreString, previous: true });
                                                }
                                            });

                                            return (
                                                <>
                                                    <div className="bg-white dark:bg-zinc-900 p-2 shadow rounded-sm text-sm">
                                                        <p className="flex gap-3 pb-2 justify-between">
                                                            <span className="font-bold">{formattedDate}</span>
                                                            {compareWithPrevious && (
                                                                <span className="font-bold opacity-75">
                                                                    → {previousFormattedDate}
                                                                </span>
                                                            )}
                                                        </p>

                                                        {items.map((i, index) => (
                                                            <p
                                                                key={index + i.name}
                                                                className="flex gap-3 justify-between"
                                                            >
                                                                <span
                                                                    className={`${i.previous ? "opacity-50 pl-0.5" : "opacity-75"}`}
                                                                >
                                                                    {i.name}
                                                                    {i.previous === undefined ? ":" : ""}
                                                                </span>
                                                                <span className="font-bold">{i.score}</span>
                                                            </p>
                                                        ))}
                                                    </div>
                                                </>
                                            );
                                        }}
                                    />
                                    <YAxis
                                        dataKey={yAxisKey}
                                        domain={[0, maxYAxisValue + 10]}
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            if (trigger.configuration.type === "money_income") {
                                                return money_formatter(value);
                                            }

                                            return long_number_formatter(value);
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
                                    {(otherTriggers ?? []).map((t, i) => (
                                        <Fragment key={`area_wrapper_${t.id}`}>
                                            {compareWithPrevious && (
                                                <Area
                                                    key={`previous_area_${t.id}`}
                                                    dataKey={`previous_${t.id}`}
                                                    type={graphType(t.configuration.type)}
                                                    stroke={getColor(i, true)}
                                                    fill={`url(#colorPrevious${t.id})`}
                                                />
                                            )}
                                            <Area
                                                key={`total_area_${t.id}`}
                                                type={graphType(t.configuration.type)}
                                                dataKey={`total_${t.id}`}
                                                stroke={getColor(i)}
                                                fill={`url(#colorCurrent${t.id})`}
                                            />
                                        </Fragment>
                                    ))}
                                    {compareWithPrevious && (
                                        <Area
                                            dataKey="previous"
                                            key={`previous_area_${trigger.id}`}
                                            type={graphType(trigger.configuration.type)}
                                            stroke={PREVIOUS_MAIN_COLOR}
                                            fill="url(#colorPrevious)"
                                        />
                                    )}
                                    <Area
                                        dataKey="total"
                                        key={`total_area_${trigger.id}`}
                                        type={graphType(trigger.configuration.type)}
                                        stroke={MAIN_COLOR}
                                        fill="url(#colorCurrent)"
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
                                            <stop offset="0" stopColor={MAIN_COLOR} stopOpacity={0.99} />
                                            <stop offset=".7" stopColor={MAIN_COLOR} stopOpacity={0} />
                                        </linearGradient>
                                        {compareWithPrevious && (
                                            <linearGradient
                                                id="colorPrevious"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="100%"
                                                color={"transparent"}
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop offset="0" stopColor={PREVIOUS_MAIN_COLOR} stopOpacity={0.99} />
                                                <stop offset=".7" stopColor={PREVIOUS_MAIN_COLOR} stopOpacity={0} />
                                            </linearGradient>
                                        )}
                                        {(otherTriggers ?? []).map((t, i) => (
                                            <Fragment key={`linarWrapper_${t.id}`}>
                                                <linearGradient
                                                    key={`linearGradient_colorCurrent${t.id}`}
                                                    id={`colorCurrent${t.id}`}
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="100%"
                                                    color={"transparent"}
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop offset="0" stopColor={getColor(i)} stopOpacity={0.99} />
                                                    <stop offset=".7" stopColor={getColor(i)} stopOpacity={0} />
                                                </linearGradient>
                                                {compareWithPrevious && (
                                                    <linearGradient
                                                        key={`linearGradient_colorPrevious${t.id}`}
                                                        id={`colorPrevious${t.id}`}
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="100%"
                                                        color={"transparent"}
                                                        gradientUnits="userSpaceOnUse"
                                                    >
                                                        <stop
                                                            offset="0"
                                                            stopColor={getColor(i, true)}
                                                            stopOpacity={0.99}
                                                        />
                                                        <stop
                                                            offset=".7"
                                                            stopColor={getColor(i, true)}
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                )}
                                            </Fragment>
                                        ))}
                                    </defs>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                );
            }}
        />
    );
}
