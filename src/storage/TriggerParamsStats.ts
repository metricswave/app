import {Trigger} from "../types/Trigger"
import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"

export type ParamsStats = { [key: string]: ParamStatRow[] }

export type ParamStatRow = {
    score: number,
    param: string,
}

export function useTriggerParamsStatsState(trigger: Trigger, period: "day" | "month", date: string | null) {
    const [stats, setStats] = useState<ParamsStats>()

    useEffect(() => {
        fetchAuthApi<ParamsStats>(
            `/triggers/${trigger.uuid}/parameters-stats?` + new URLSearchParams({
                period,
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
