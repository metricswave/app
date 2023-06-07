import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {Stats, useTriggerStatsState} from "../../storage/TriggerStats"
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useState} from "react"
import {NoLinkButton} from "../buttons/LinkButton"
import {eachDayOfInterval, eachMonthOfInterval} from "date-fns"
import {number_formatter} from "../../helpers/NumberFormatter"

function getGraphData(stats: Stats, view: "daily" | "monthly") {
    const data = stats[view].map((stat) => ({
        name: stat.date,
        total: stat.score,
    }))


    // Fill missing days in data from today to 30 days ago
    const today = new Date()
    if (view === "daily") {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(today.getDate() - 30)
        const graphData: Date[] = eachDayOfInterval({start: thirtyDaysAgo, end: today})
        graphData.forEach((date) => {
            const dateStr = date.toISOString().split("T")[0]
            if (!stats[view].find((stat) => new Date(stat.date).toISOString().split("T")[0] === dateStr)) {
                data.push({
                    name: date,
                    total: 0,
                })
            }
        })
    }

    if (view === "monthly") {
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(today.getMonth() - 12)
        const graphData: Date[] = eachMonthOfInterval({start: twelveMonthsAgo, end: today})
        graphData.forEach((date) => {
            const dateStr = date.toISOString().split("T")[0]
            if (!stats[view].find((stat) => new Date(stat.date).toISOString().split("T")[0] === dateStr)) {
                data.push({
                    name: date,
                    total: 0,
                })
            }
        })
    }

    data.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
    return data
}

export function TriggerStats({trigger}: { trigger: Trigger }) {
    const [view, setView] = useState<"daily" | "monthly">("daily")
    const {stats} = useTriggerStatsState(trigger)
    const data = getGraphData(stats, view)
    const average = number_formatter(data.reduce((acc, curr) => acc + curr.total, 0) / data.length)

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-sm p-5 pb-1 shadow">
            <div className="pb-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                {view === "daily" &&
                    <PageTitle title="📊 Daily Stats" description={`${average} average hits per day.`}/>}

                {view === "monthly" &&
                    <PageTitle title="📊 Monthly Stats" description={`${average} average hits per month`}/>}

                <div className="text-sm text-right">
                    {view === "daily" ? (
                        <NoLinkButton text={"View monthly stats"} onClick={() => setView("monthly")}/>
                    ) : (
                        <NoLinkButton text={"View daily stats"} onClick={() => setView("daily")}/>
                    )}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <Tooltip
                        cursor={{fill: "#ffffff", opacity: "0.05"}}
                        content={({active, payload, label}) => {
                            const date = new Date(label)
                            const formattedDate = view === "daily" ? date.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                            }) : date.toLocaleDateString(undefined, {
                                month: "short",
                                year: "numeric",
                            })
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
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}


