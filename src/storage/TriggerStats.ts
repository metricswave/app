import {Trigger} from "../types/Trigger"
import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"

export type Stats = {
    daily: StatRow[],
    weekly: StatRow[],
    monthly: StatRow[],
}

type StatRow = {
    date: string,
    score: number,
}

export function useTriggerStatsState(trigger: Trigger) {
    const initialState = {monthly: [], weekly: [], daily: []}
    const [stats, setStats] = useState<Stats>(initialState)

    useEffect(() => {
        fetchAuthApi<Stats>(
            `/triggers/${trigger.uuid}/stats`,
            {
                success: (data) => setStats(data.data),
                error: () => setStats(initialState),
                catcher: () => setStats(initialState),
            },
        )
    }, [trigger])

    return {stats}
}
