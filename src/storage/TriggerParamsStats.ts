import {Trigger} from "../types/Trigger"
import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {Period} from "../types/Period"

export type ParamsStats = { [key: string]: ParamStatRow[] }

export type ParamStatRow = {
    score: number,
    param: string,
}

export function useTriggerParamsStatsState(trigger: Trigger, period: Period, date: string | null) {
    const [stats, setStats] = useState<ParamsStats>()

    useEffect(() => {
        const apiPeriod = period === "daily" ? "day" : "month"
        fetchAuthApi<ParamsStats>(
            `/triggers/${trigger.uuid}/parameters-stats?` + new URLSearchParams({
                period: apiPeriod,
                ...(date ? {date} : {}),
            }),
            {
                success: (data) => setStats(data.data),
                error: () => setStats(undefined),
                catcher: () => setStats(undefined),
            },
        )
    }, [trigger, period, date])

    return {stats}
}
