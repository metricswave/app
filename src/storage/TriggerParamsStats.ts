import {Trigger} from "../types/Trigger"
import {useState} from "react"
import {ApiResponse, fetchApi, fetchAuthApi} from "../helpers/ApiFetcher"
import {Period, safeApiPeriod} from "../types/Period"
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage"
import {getPreviousPeriodDate} from "./TriggerStats"

export type ParamsStats = { plot: { [key: string]: ParamStatRow[] } }

export type ParamStatRow = {
    score: number,
    param: string,
}

export function useTriggerParamsStatsState() {
    const [statsLoading, setStatsLoading] = useState<boolean>(false)
    const [stats, setStats] = useState<ParamsStats | undefined>()
    const [previousStats, setPreviousStats] = useState<ParamsStats | undefined>()
    const [previousStatsLoading, setPreviousStatsLoading] = useState<boolean>(false)

    const setStatsFor = (stats: ParamsStats | undefined, current: boolean) => {
        if (current) {
            setStats(stats)
        } else {
            setPreviousStats(stats)
        }
    }

    const setLoadingFor = (loading: boolean, current: boolean) => {
        if (current) {
            setStatsLoading(loading)
        } else {
            setPreviousStatsLoading(loading)
        }
    }

    const loadStatsFor = (
        current: boolean,
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
    ) => {
        const key = `trigger-params-stats-v1-${trigger.uuid}-${period}-${date ?? ""}-${publicDashboard ?? ""}`
        const query = new URLSearchParams({period: safeApiPeriod(period), ...(date ? {date} : {})})
        const methods = {
            success: (data: ApiResponse<ParamsStats>) => {
                if (publicDashboard === undefined) {
                    expirableLocalStorage.set(key, data.data, FIVE_SECONDS)
                }
                setStatsFor(data.data, current)
                setLoadingFor(false, current)
            },
            error: () => {
                setStatsFor(undefined, current)
                setLoadingFor(false, current)
            },
            catcher: () => {
                setStatsFor(undefined, current)
                setLoadingFor(false, current)
            },
        }

        const cachedData = expirableLocalStorage.get(key, null)
        if (publicDashboard === undefined && cachedData !== null) {
            setStatsFor(cachedData, current)
            setLoadingFor(false, current)
            return
        }

        setLoadingFor(true, current)
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

    const loadStats = (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
    ) => {
        loadStatsFor(true, trigger, period, date, publicDashboard)
    }

    const loadPreviousStats = (
        trigger: Trigger,
        period: Period,
        date: string | null,
        publicDashboard: string | undefined,
    ) => {
        loadStatsFor(false, trigger, period, getPreviousPeriodDate(period, date), publicDashboard)
    }

    return {stats, previousStats, loadStats, loadPreviousStats, statsLoading: statsLoading || previousStatsLoading}
}
