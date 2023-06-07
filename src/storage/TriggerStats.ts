import {Trigger} from "../types/Trigger"
import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"

export type Stats = {
    daily: StatRow[],
    monthly: StatRow[],
}

type StatRow = {
    date: string,
    score: number,
}

export function useTriggerStatsState(trigger: Trigger) {
    const [stats, setStats] = useState<Stats>({monthly: [], daily: []})

    useEffect(() => {
        fetchAuthApi<Stats>(
            `/triggers/${trigger.uuid}/stats`,
            {
                success: (data) => setStats(data.data),
                error: () => setStats({monthly: [], daily: []}),
                catcher: () => setStats({monthly: [], daily: []}),
            },
        )
    }, [trigger])

    return {stats}
}
