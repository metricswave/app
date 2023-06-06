import {Trigger} from "../types/Trigger"
import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"

type Stats = {
    daily: StatRow[],
    monthly: StatRow[],
}

type StatRow = {
    date: Date,
    score: number,
}

export function useTriggerStatsState(trigger: Trigger) {
    const [stats, setStats] = useState<Stats>({monthly: [], daily: []})

    useEffect(() => {
        fetchAuthApi<Stats>(
            `/triggers/${trigger.uuid}/stats`,
            {
                success: (data) => setStats(data.data),
                error: (data) => setStats({monthly: [], daily: []}),
                catcher: (data) => setStats({monthly: [], daily: []}),
            },
        )
    }, [trigger])

    return {stats}
}
