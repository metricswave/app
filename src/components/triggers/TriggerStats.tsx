import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {Stats, useTriggerStatsState} from "../../storage/TriggerStats"
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useEffect, useState} from "react"
import {number_formatter} from "../../helpers/NumberFormatter"
import {calculateDefaultDateForPeriod, fieldTypeForPeriod, Period} from "../../types/Period"
import InputFieldBox from "../form/InputFieldBox"
import {ArrowDownIcon, ArrowUpIcon} from "@radix-ui/react-icons"
import {TriggerStatsLoading} from "./TriggerStatsLoading"
import {percentage_diff} from "../../helpers/PercentageOf"

function getGraphData(stats: Stats, previousPeriodStats: Stats, view: Period) {
    const data = stats.plot.map((stat, index) => ({
        name: stat.date,
        total: stat.score,
        previous: previousPeriodStats?.plot[index]?.score ?? 0,
        previousName: previousPeriodStats?.plot[index]?.date ?? "",
    }))

    data.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
    return data
}

type Props = {
    title: string
    trigger: Trigger
    publicDashboard?: string | undefined
    defaultPeriod: Period
    defaultDate?: string
    hideViewSwitcher?: boolean
    compareWithPrevious?: boolean
}

export function TriggerStats(
    {
        title,
        trigger,
        publicDashboard,
        defaultPeriod,
        defaultDate,
        hideViewSwitcher = false,
        compareWithPrevious = false,
    }: Props,
) {
    const [period, setPeriod] = useState<Period>(defaultPeriod)
    const {stats, previousPeriodStats, loadStats, loadPreviousPeriodStats, statsLoading} = useTriggerStatsState()
    const [data, setData] = useState<{ name: string, total: number }[]>()
    const [average, setAverage] = useState("")
    const [date, setDate] = useState<string>(defaultDate ?? calculateDefaultDateForPeriod(period))
    const [fieldDate, setFieldDate] = useState<string>()
    const dateFieldType = fieldTypeForPeriod(period)
    const setPeriodAndDate = (period: Period) => {
        const date = calculateDefaultDateForPeriod(period)
        setDate(date)
        setFieldDate(
            fieldTypeForPeriod(period) === "month" ? date.slice(0, 7) : date,
        )
        setPeriod(period)
    }

    useEffect(() => {
        setDate(
            fieldTypeForPeriod(period) === "month" ? fieldDate + "-01" : fieldDate!,
        )
    }, [fieldDate])
    useEffect(() => setPeriodAndDate(defaultPeriod), [defaultPeriod])
    useEffect(() => setDate(defaultDate!), [defaultDate])
    useEffect(() => loadStats(trigger, period, date, publicDashboard), [trigger.id, period, date, publicDashboard])
    useEffect(
        () => compareWithPrevious ? loadPreviousPeriodStats(trigger, period, date, publicDashboard) : undefined,
        [trigger.id, compareWithPrevious, period, date, publicDashboard],
    )
    useEffect(() => {
        const data = getGraphData(stats, previousPeriodStats, period)
        const average = data.reduce((acc, curr) => acc + curr.total, 0) / data.length
        setData(data)
        setAverage(isNaN(average) ? "0" : number_formatter(average, {maximumFractionDigits: 0}))
    }, [stats, previousPeriodStats, period])

    if (statsLoading) {
        return (<TriggerStatsLoading/>)
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="pb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                {title !== undefined && <PageTitle
                    title={title}
                    description={`${average} average hits in period.`}
                />}
                {!hideViewSwitcher &&
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
                }
            </div>

            {stats.headers !== null &&
                <div className="flex flex-col sm:flex-row justify-start sm:items-center mb-10">
                    {Object.values(stats.headers).map((header, index) => {
                        const key = Object.keys(stats.headers!)[index] as "unique" | "pageViews" | "visits"
                        const previousStatsHeaders = previousPeriodStats?.headers ? (previousPeriodStats?.headers[key]) : 0
                        const percentageDifference = percentage_diff(header, previousStatsHeaders)

                        return (
                            <div
                                key={key}
                                className="flex flex-col text-right justify-between items-start gap-1 sm:border-r soft-border py-2 sm:py-0 sm:px-14 first:pl-0 last:pr-0 last:border-none"
                            >

                                <div className="flex items-start justify-center gap-3">
                                    <div className="text-sm text-gray-400 dark:text-gray-600">
                                        {{
                                            "unique": "Unique visits",
                                            "pageViews": "Page views",
                                            "visits": "Visits",
                                        }[Object.keys(stats.headers!)[index]]}
                                    </div>

                                </div>

                                <div className="text-2xl font-medium">{number_formatter(header)}</div>

                                {compareWithPrevious &&
                                    <div className="flex flex-row justify-start gap-2 items-baseline">
                                        <div className="text-2xl font-medium opacity-50">
                                            {number_formatter(previousStatsHeaders)}
                                        </div>
                                        {compareWithPrevious && <div className="flex items-start gap-0.5">
                                            {percentageDifference > 0 ?
                                                <ArrowUpIcon className="h-4 text-green-500"/> :
                                                <ArrowDownIcon className="h-4 text-red-500"/>
                                            }
                                            <div className="text-sm text-gray-400 dark:text-gray-600">
                                                {number_formatter(percentageDifference)}%
                                            </div>
                                        </div>}
                                    </div>}

                            </div>
                        )
                    })}
                </div>
            }

            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data}>
                    <Tooltip
                        cursor={{fill: "#ffffff", opacity: "0.05"}}
                        content={({payload, label}) => {
                            const date = new Date((payload?.[0]?.payload?.name ?? "") as string)
                            const formattedDate = date.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                            })

                            const score = (payload?.[0]?.value ?? 0) as number
                            const scoreString = number_formatter(score, {maximumFractionDigits: 0})

                            if (compareWithPrevious) {
                                const previousDate = new Date((payload?.[1]?.payload?.previousName ?? "") as string)
                                const formattedPreciousDate = previousDate.toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                })

                                const previousScore = (payload?.[1]?.value ?? 0) as number
                                const previousScoreString = number_formatter(previousScore, {maximumFractionDigits: 0})

                                const diffPercentage = (score - previousScore) / previousScore * 100

                                return (<>
                                    <div className="bg-white dark:bg-zinc-900 p-2 shadow rounded-sm text-sm">
                                        <p className="flex flex-row justify-between gap-2">
                                            <span className="opacity-75">{formattedDate}</span>
                                            <span className="font-bold min-w-[60px] text-right">{scoreString}</span>
                                        </p>
                                        <p className="flex flex-row justify-between gap-2">
                                            <span className="opacity-75">{formattedPreciousDate}</span>
                                            <span className="font-bold min-w-[60px] text-right">{previousScoreString}</span>
                                        </p>
                                        <p className="flex flex-row justify-between gap-2">
                                            <span></span>
                                            <div className="flex flex-row gap-0.5 justify-end items-center font-bold min-w-[60px] text-right">
                                                {diffPercentage >= 0 &&
                                                    <ArrowUpIcon className="text-green-500"/>}
                                                {diffPercentage < 0 && <ArrowDownIcon className="text-red-500"/>}
                                                {number_formatter(diffPercentage, {maximumFractionDigits: 0})}%
                                            </div>
                                        </p>
                                    </div>
                                </>)
                            }

                            return (<>
                                <div className="bg-white dark:bg-zinc-900 p-2 shadow rounded-sm text-sm">
                                    <p>
                                        <span className="opacity-75">{formattedDate}:</span>
                                        <span className="font-bold">{scoreString}</span>
                                    </p>
                                </div>
                            </>)
                        }}

                    />
                    <XAxis dataKey="name"
                           stroke="#888888"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => {
                               const date = new Date(value)
                               return date.toLocaleDateString(undefined, {
                                   month: "short",
                                   day: "numeric",
                               })
                           }}/>
                    <YAxis stroke="#888888"
                           fontSize={12}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => number_formatter(value)}/>
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
                            <stop offset="0" stopColor="#3b82f6" stopOpacity={.99}/>
                            <stop offset=".7" stopColor="#3b82f6" stopOpacity={0}/>
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
                            <stop offset="0" stopColor="#78716c" stopOpacity={.99}/>
                            <stop offset=".7" stopColor="#78716c" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area
                        type={"step"}
                        dataKey="total"
                        stroke="#3b82f6"
                        fill="url(#colorCurrent)"
                    />
                    {compareWithPrevious && <Area
                        type={"step"}
                        dataKey="previous"
                        stroke="#78716c"
                        fill="url(#colorPrevious)"
                    />}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
