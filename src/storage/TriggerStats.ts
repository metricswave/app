import {Trigger} from "../types/Trigger"
import {useEffect, useState} from "react"
import {fetchApi, fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage"

export type Stats = {
    daily: StatRow[],
    weekly: StatRow[],
    monthly: StatRow[],
}

type StatRow = {
    date: string,
    score: number,
}

export function useTriggerStatsState(trigger: Trigger, publicDashboard: string | undefined) {
    const key = `trigger-stats-${trigger.uuid}`
    const initialState = publicDashboard === undefined ?
        expirableLocalStorage.get(key, {monthly: [], weekly: [], daily: []}) :
        {monthly: [], weekly: [], daily: []}
    const [stats, setStats] = useState<Stats>(initialState)

    const setStatsAndCache = (data: Stats) => {
        setStats(data)
        expirableLocalStorage.set(key, data, FIVE_SECONDS)
    }

    useEffect(() => {
        if (publicDashboard !== undefined) {
            fetchApi<Stats>(`/dashboards/${publicDashboard}/triggers/${trigger.uuid}/stats`, {
                success: (data) => setStats(data.data),
                error: () => setStats(initialState),
                catcher: () => setStats(initialState),
            })
            return
        }

        if (expirableLocalStorage.get(key, null) !== null) {
            return
        }

        fetchAuthApi<Stats>(
            `/triggers/${trigger.uuid}/stats`,
            {
                success: (data) => setStatsAndCache(data.data),
                error: () => setStats(initialState),
                catcher: () => setStats(initialState),
            },
        )
    }, [trigger])

    return {stats}
}
