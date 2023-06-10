import {useState} from "react"
import {Trigger} from "../../types/Trigger"
import {ParamStatRow, useTriggerParamsStatsState} from "../../storage/TriggerParamsStats"
import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox"
import PageTitle from "../sections/PageTitle"
import {number_formatter} from "../../helpers/NumberFormatter"
import InputFieldBox from "../form/InputFieldBox"

function percentage_of(totalScore: number, score: number): number {
    return Math.min(100, Math.max(Math.round((score / totalScore) * 100), 1))
}

export function TriggerParamsStats({trigger}: { trigger: Trigger }) {
    const [params] = useState<string[]>(trigger.configuration.fields["parameters"] as string[])
    const [parameter, setParameter] = useState<string>(params[0])
    const [period, setPeriod] = useState<"day" | "month">("day")
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])

    const setPeriodAndDate = (period: "day" | "month") => {
        setDate(
            period === "day" ?
                new Date().toISOString().split("T")[0] :
                new Date().toISOString().split("T")[0].slice(0, 7),
        )
        setPeriod(period)
    }

    // Get stats for the selected period and parameter
    const dateFilter = period === "month" ? date + "-01" : date
    const {stats} = useTriggerParamsStatsState(trigger, period, dateFilter)

    const paramStats: ParamStatRow[] = stats !== undefined ? Object.values(stats[parameter]) : []
    paramStats.sort((a, b) => b.score - a.score)
    const totalScore = paramStats.reduce((acc, curr) => acc + curr.score, 0)

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-sm p-5 pb-4 shadow">
            <div className="pb-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                <PageTitle title="Stats by Parameter" description={`${totalScore} hits in period.`}/>
            </div>
            <div className="flex flex-row items-center justify-between">
                <div className="w-1/3">
                    <InputFieldBox
                        setValue={setDate}
                        label="Date"
                        type={period === "day" ? "date" : "month"}
                        name="date"
                        placeholder={"Date"}
                        value={date}
                    />
                </div>

                <div className="flex flex-row flex-grow items-center justify-end space-x-3">
                    <DropDownSelectFieldBox
                        value={parameter}
                        options={params.map((param) => ({value: param, label: param}))}
                        setValue={(value) => {
                            setParameter(value as string)
                        }}
                        className="w-1/3"
                        label="Parameter"
                        name="parameter"
                    />

                    <DropDownSelectFieldBox
                        className="w-1/3"
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
                            setPeriodAndDate(value as "day" | "month")
                        }}
                        label="Period"
                        name="period"
                    />

                </div>
            </div>

            {paramStats.length === 0 ? (
                <div className="w-full flex items-center justify-center text-center h-64">
                    <div className="opacity-50">No stats for this period.</div>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col space-y-2 py-3 pt-10">
                        <div className="flex font-bold flex-row items-center justify-between space-x-3">
                            <p>Parameter</p>
                            <p>Hits</p>
                        </div>
                    </div>

                    {paramStats.map((stat) => (
                        <div
                            key={stat.param}
                            className="flex flex-col space-y-2 py-3"
                        >
                            <div className="flex flex-row items-center justify-between space-x-3">
                                <p className="opacity-75">{stat.param}</p>
                                <p className="opacity-75">{number_formatter(stat.score)}</p>
                            </div>

                            <div className="w-full flex flex-row space-x-2">
                                {[0, 1, 2, 3].map((i) => {
                                    const barPercentage = percentage_of(totalScore, stat.score) - (25 * i)
                                    const p = barPercentage < 1 ? 0 : Math.min(barPercentage, 25)
                                   
                                    return (
                                        <div key={i} className="h-1 rounded bg-blue-500"
                                             style={{width: `${p}%`}}>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
