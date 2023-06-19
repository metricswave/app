import {Trigger} from "../types/Trigger"
import {useEffect, useState} from "react"
import {fetchApi, fetchAuthApi} from "../helpers/ApiFetcher"
import {apiPeriodFromPeriod, Period} from "../types/Period"
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage"

export type ParamsStats = { [key: string]: ParamStatRow[] }

export type ParamStatRow = {
    score: number,
    param: string,
}

export function useTriggerParamsStatsState(
    trigger: Trigger,
    period: Period,
    date: string | null,
    publicDashboard: string | undefined,
) {
    const key = `trigger-params-stats-5-${trigger.uuid}-${period}-${date}`
    const [stats, setStats] = useState<ParamsStats | undefined>(
        publicDashboard === undefined ?
            expirableLocalStorage.get(key, undefined) :
            undefined,
    )

    const setStatsAndCache = (data: ParamsStats) => {
        setStats(data)
        expirableLocalStorage.set(key, data, FIVE_SECONDS)
    }

    useEffect(() => {
        const apiPeriod = apiPeriodFromPeriod(period)

        if (publicDashboard !== undefined) {
            fetchApi<ParamsStats>(
                `/dashboards/${publicDashboard}/triggers/${trigger.uuid}/parameters-stats?` + new URLSearchParams({
                    period: apiPeriod, ...(date ? {date} : {}),
                }),
                {
                    success: (data) => setStats(data.data),
                    error: () => setStats(undefined),
                    catcher: () => setStats(undefined),
                },
            )

            return
        }

        if (expirableLocalStorage.get(key, null) !== null) {
            return
        }

        fetchAuthApi<ParamsStats>(
            `/triggers/${trigger.uuid}/parameters-stats?` + new URLSearchParams({
                period: apiPeriod,
                ...(date ? {date} : {}),
            }),
            {
                success: (data) => setStatsAndCache(data.data),
                error: () => setStats(undefined),
                catcher: () => setStats(undefined),
            },
        )
    }, [trigger, period, date])

    return {stats}
}
