import {Trigger} from "../types/Trigger"
import {useState} from "react"
import {ApiResponse, fetchApi, fetchAuthApi} from "../helpers/ApiFetcher"
import {Period} from "../types/Period"
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage"

export type ParamsStats = { plot: { [key: string]: ParamStatRow[] } }

export type ParamStatRow = {
    score: number,
    param: string,
}

export function useTriggerParamsStatsState() {
    const [statsLoading, setStatsLoading] = useState<boolean>(false)
    const [stats, setStats] = useState<ParamsStats | undefined>()

    const loadStats = (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
    ) => {
        const key = `trigger-params-stats-5-${trigger.uuid}-${period}-${date ?? ""}`

        if (publicDashboard === undefined) {
            setStats(expirableLocalStorage.get(key, undefined))
        }

        setStatsLoading(true)

        const query = new URLSearchParams({period, ...(date ? {date} : {})})

        const methods = {
            success: (data: ApiResponse<ParamsStats>) => {
                if (publicDashboard === undefined) {
                    expirableLocalStorage.set(key, data, FIVE_SECONDS)
                }
                setStats(data.data)
                setStatsLoading(false)
            },
            error: () => {
                setStats(undefined)
                setStatsLoading(false)
            },
            catcher: () => {
                setStats(undefined)
                setStatsLoading(false)
            },
        }

        if (publicDashboard === undefined && expirableLocalStorage.get(key, null) !== null) {
            setStatsLoading(false)
            return
        }

        if (publicDashboard !== undefined) {
            fetchApi<ParamsStats>(
                `/dashboards/${publicDashboard}/triggers/${trigger.uuid}/parameters-graph-stats?` + query,
                methods,
            )
        } else {
            fetchAuthApi<ParamsStats>(
                `/triggers/${trigger.uuid}/parameters-graph-stats?` + query,
                methods,
            )
        }
    }

    return {stats, loadStats, statsLoading}
}
