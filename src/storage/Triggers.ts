import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {DAY_SECONDS, expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {Triggers} from "../types/Triggers"

const TRIGGER_KEY: string = "nw:triggers"
const TRIGGER_REFRESH_KEY: string = "nw:triggers:refresh"

export function useTriggersState() {
    const [isFresh, setIsFresh] = useState<true | false>(
        expirableLocalStorage.get(TRIGGER_REFRESH_KEY, false),
    )
    const [triggers, setTriggers] = useState<Triggers[]>(
        expirableLocalStorage.get(TRIGGER_KEY, []),
    )

    useEffect(() => {
        if (triggers.length > 0 && isFresh) {
            return
        }

        fetchAuthApi<{ triggers: Triggers[] }>("/triggers", {
            success: (data) => {
                const t = data.data.triggers
                expirableLocalStorage.set(TRIGGER_REFRESH_KEY, true, DAY_SECONDS)
                expirableLocalStorage.set(TRIGGER_KEY, t)
                setTriggers(t)
                setIsFresh(true)
            },
            error: (data) => setIsFresh(false),
            catcher: (err) => setIsFresh(false),
        })
    }, [isFresh])

    return {triggers, refreshTriggers: () => setIsFresh(false)}
}
