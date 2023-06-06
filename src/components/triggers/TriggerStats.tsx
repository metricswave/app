import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {useTriggerStatsState} from "../../storage/TriggerStats"
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts"
import {useState} from "react"
import {NoLinkButton} from "../buttons/LinkButton"

export function TriggerStats({trigger}: { trigger: Trigger }) {
    const [view, setView] = useState<"daily" | "monthly">("daily")
    const {stats} = useTriggerStatsState(trigger)

    const data = stats[view].reverse().map((stat) => ({
        name: stat.date,
        total: stat.score,
    }))

    return (
        <div className="bg-white rounded-sm p-5 pb-1 shadow">
            <div className="pb-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                {view === "daily" && <PageTitle title="📊 Daily Stats"/>}

                {view === "monthly" && <PageTitle title="📊 Monthly Stats"/>}

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
                           width={20}
                           tickLine={false}
                           axisLine={false}
                           tickFormatter={(value) => `${value}`}/>
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
