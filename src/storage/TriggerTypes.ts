import {useEffect, useState} from "react"
import {TriggerType} from "../types/TriggerType"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {DAY_SECONDS, expirableLocalStorage} from "../helpers/ExpirableLocalStorage"

const TRIGGER_TYPES_KEY: string = "nw:trigger-types"
const TRIGGER_TYPES_REFRESH_KEY: string = "nw:trigger-types:refresh"

export function useTriggerTypesState() {
    const [isFresh, setIsFresh] = useState<true | false>(
        expirableLocalStorage.get(TRIGGER_TYPES_REFRESH_KEY, false),
    )
    const [triggerTypes, setTriggerTypes] = useState<TriggerType[]>(
        expirableLocalStorage.get(TRIGGER_TYPES_KEY, []),
    )

    useEffect(() => {
        if (triggerTypes.length > 0 && isFresh) {
            return
        }

        fetchAuthApi<{ trigger_types: TriggerType[] }>("/trigger-types", {
            success: (data) => {
                const tt = data.data.trigger_types
                expirableLocalStorage.set(TRIGGER_TYPES_REFRESH_KEY, true, DAY_SECONDS)
                expirableLocalStorage.set(TRIGGER_TYPES_KEY, tt)
                setTriggerTypes(tt)
                setIsFresh(true)
            },
            error: (data) => setIsFresh(false),
            catcher: (err) => setIsFresh(false),
        })
    }, [isFresh])

    return {triggerTypes, setIsFresh}
}
