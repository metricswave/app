import {useEffect, useState} from "react"
import {fetchApi} from "../helpers/ApiFetcher"
import {Trigger} from "../types/Trigger"

export function usePublicDashboardTriggersState(dashboardUuid: string) {
    const [loadedTriggers, setLoadedTriggers] = useState<boolean>(false)
    const [triggers, setTriggers] = useState<Trigger[]>([])

    useEffect(() => {
        fetchApi<Trigger[]>(`/dashboards/${dashboardUuid}/triggers`, {
            success: (data) => {
                const t = data.data
                setTriggers(t)
                setLoadedTriggers(true)
            },
            error: (data) => null,
            catcher: (err) => null,
        })
    }, [])

    return {
        triggers,
        loadedTriggers,
        triggerByUuid: (uuid: string) => triggers.find(t => t.uuid === uuid),
    }
}
