import {Trigger} from "../types/Trigger"
import {useState} from "react"
import {ApiResponse, fetchApi, fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage"
import {Period} from "../types/Period"

export type Stats = {
    headers: null | { unique: number, pageViews: number, visits: number }
    plot: StatRow[],
}

type StatRow = {
    date: string,
    score: number,
}

export function useTriggerStatsState() {
    const defaultState = {headers: null, plot: []}
    const [stats, setStats] = useState<Stats>(defaultState)
    const [statsLoading, setStatsLoading] = useState<boolean>(false)

    const loadStats = (trigger: Trigger, period: Period, date: string | null, publicDashboard: string | undefined) => {
        const key = `trigger-graph-stats-${trigger.uuid}-${period}-${date ?? ""}`

        if (publicDashboard === undefined) {
            setStats(expirableLocalStorage.get(key, defaultState))
        }

        setStatsLoading(true)

        const methods = {
            success: (data: ApiResponse<Stats>) => {
                if (publicDashboard === undefined) {
                    expirableLocalStorage.set(key, data.data, FIVE_SECONDS)
                }
                setStats(data.data)
                setStatsLoading(false)
            },
            error: () => {
                setStats(defaultState)
                setStatsLoading(false)
            },
            catcher: () => {
                setStats(defaultState)
                setStatsLoading(false)
            },
        }

        if (publicDashboard === undefined && expirableLocalStorage.get(key, null) !== null) {
            setStatsLoading(false)
            return
        }

        const params = new URLSearchParams({period, ...(date ? {date} : {})}).toString()
        if (publicDashboard !== undefined) {
            fetchApi<Stats>(
                `/dashboards/${publicDashboard}/triggers/${trigger.uuid}/graph-stats?` + params,
                methods,
            )
            return
        }

        fetchAuthApi<Stats>(
            `/triggers/${trigger.uuid}/graph-stats?` + params,
            methods,
        )
    }

    return {stats, loadStats, statsLoading}
}
