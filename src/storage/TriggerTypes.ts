import {useEffect, useState} from "react"
import {TriggerType} from "../types/TriggerType"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, TEN_MINUTES_SECONDS} from "../helpers/ExpirableLocalStorage"
import {TriggerTypeId} from "../types/Trigger"

const TRIGGER_TYPES_KEY: string = "nw:trigger-types"
const TRIGGER_TYPES_REFRESH_KEY: string = "nw:trigger-types:refresh"

function mapTriggerTypes(trigger_types: TriggerType[]): TriggerType[] {
    return trigger_types
        .filter((tt) => {
            return tt.id !== TriggerTypeId.CalendarTimeToLeave || localStorage.getItem("nw:triggers:show-all") === "1"
        })
}

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
                const tt = mapTriggerTypes(data.data.trigger_types)
                expirableLocalStorage.set(TRIGGER_TYPES_REFRESH_KEY, true, TEN_MINUTES_SECONDS)
                expirableLocalStorage.set(TRIGGER_TYPES_KEY, tt)
                setTriggerTypes(tt)
                setIsFresh(true)
            },
            error: (data) => setIsFresh(false),
            catcher: (err) => setIsFresh(false),
        })
    }, [isFresh])

    return {
        triggerTypes,
        refreshTriggerTypes: () => setIsFresh(false),
        getTriggerTypeById(id: number): TriggerType | undefined {
            return triggerTypes.find((tt) => tt.id === id)
        },
    }
}
