import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {Stats, useTriggerStatsState} from "../../storage/TriggerStats"
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useEffect, useState} from "react"
import {NoLinkButton} from "../buttons/LinkButton"
import {eachDayOfInterval, eachMonthOfInterval} from "date-fns"
import {number_formatter} from "../../helpers/NumberFormatter"
import {apiPeriodFromPeriod, Period} from "../../types/Period"

function getGraphData(stats: Stats, view: Period) {
    const data = stats[view].map((stat) => ({
        name: stat.date,
        total: stat.score,
    }))

    // Fill missing days in data from today to 30 days ago
    const today = new Date()

    if (view === "daily") {
        today.setDate(today.getDate() + 1)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(today.getDate() - 30)
        const graphData: Date[] = eachDayOfInterval({start: thirtyDaysAgo, end: today})
        graphData.forEach((date) => {
            const dateStr = date.toISOString().split("T")[0]
            if (!stats[view].find((stat) => stat.date.split("T")[0] === dateStr)) {
                data.push({
                    name: dateStr,
                    total: 0,
                })
            }
        })
    } else if (view === "monthly") {
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(today.getMonth() - 12)
        const graphData: Date[] = eachMonthOfInterval({start: twelveMonthsAgo, end: today})
        graphData.forEach((date) => {
            const dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0]
            if (!stats[view].find((stat) => stat.date.split("T")[0] === dateStr)) {
                data.push({
                    name: dateStr,
                    total: 0,
                })
            }
        })
    }

    data.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
    return data
}

type Props = {
    trigger: Trigger
    title?: string
    hideViewSwitcher?: boolean
    defaultView?: Period
}

export function TriggerStats({trigger, title, defaultView = "daily", hideViewSwitcher = false}: Props) {
    const [view, setView] = useState<Period>(defaultView)
    const {stats} = useTriggerStatsState(trigger)
    const data = getGraphData(stats, view)
    const average = number_formatter(data.reduce((acc, curr) => acc + curr.total, 0) / data.length)
    const viewText = apiPeriodFromPeriod(view)

    useEffect(() => {
        setView(defaultView)
    }, [defaultView])

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-sm p-5 pb-1 shadow">
            <div className="pb-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                {title !== undefined && <PageTitle
                    title={title}
                    description={`${average} average hits per ${viewText}.`}
                />}

                {title === undefined &&
                    <PageTitle title="Stats" description={`${average} average hits per ${viewText}.`}/>}

                {!hideViewSwitcher && <div className="text-sm text-right">
                    {view === "daily" ? (
                        <NoLinkButton text={"View monthly stats"} onClick={() => setView("monthly")}/>
                    ) : (
                        <NoLinkButton text={"View daily stats"} onClick={() => setView("daily")}/>
                    )}
                </div>}
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <Tooltip
                        cursor={{fill: "#ffffff", opacity: "0.05"}}
                        content={({payload, label}) => {
                            const date = new Date(label)
                            let formattedDate

                            if (view === "daily") {
                                formattedDate = date.toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                })
                            } else if (view === "monthly") {
                                formattedDate = date.toLocaleDateString(undefined, {
                                    month: "short",
                                    year: "numeric",
                                })
                            }

                            const score = payload?.[0]?.value ?? 0

                            return (<>
                                <div className="bg-white dark:bg-zinc-800 p-2 shadow rounded-sm text-sm">
                                    <p>{formattedDate}: <span>{score}</span></p>
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
                               if (view === "daily") {
                                   return date.toLocaleDateString(undefined, {
                                       month: "short",
                                       day: "numeric",
                                   })
                               } else {
                                   date.setMonth(date.getMonth() - 1)
                                   return date.toLocaleDateString(undefined, {
                                       month: "short",
                                       year: "numeric",
                                   })
                               }
                           }}/>
                    <YAxis stroke="#888888"
                           fontSize={12}
                           width={24}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => `${value}`}/>
                    <defs>
                        <linearGradient
                            id="colorUv"
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
                    </defs>
                    <Bar dataKey="total"
                         stackId="total"
                         radius={[2, 2, 0, 0]}
                         fill="url(#colorUv)"
                         shape={BarWithBorder(1, "#3b82f6")}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

const BarWithBorder = (borderHeight: number, borderColor: string) => {
    return (props: any) => {
        const {fill, x, y, width, height} = props
        return (
            <g>
                <rect opacity={.7} x={x} y={y + 1} width={width} height={height} stroke="none" fill={fill}/>
                <rect opacity={.7} x={x} y={y} width={width} height={borderHeight} stroke="none" fill={borderColor}/>
                <rect opacity={.7} x={x} y={y} width={borderHeight} height={height} stroke="none" fill={borderColor}/>
                <rect opacity={.7}
                      x={x + width}
                      y={y}
                      width={borderHeight}
                      height={height}
                      stroke="none"
                      fill={borderColor}/>
            </g>
        )
    }
}
