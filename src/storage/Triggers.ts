import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, THIRTY_SECONDS} from "../helpers/ExpirableLocalStorage"
import {Trigger} from "../types/Trigger"

const TRIGGER_KEY: string = "nw:triggers"
const TRIGGER_REFRESH_KEY: string = "nw:triggers:refresh"

export function useTriggersState() {
    const [isFresh, setIsFresh] = useState<true | false>(
        expirableLocalStorage.get(TRIGGER_REFRESH_KEY, false),
    )
    const [triggers, setTriggers] = useState<Trigger[]>(
        expirableLocalStorage.get(TRIGGER_KEY, []),
    )

    useEffect(() => {
        if (triggers.length > 0 && isFresh) {
            return
        }

        fetchAuthApi<{ triggers: Trigger[] }>("/triggers", {
            success: (data) => {
                const t = mapTriggers(data.data.triggers)
                expirableLocalStorage.set(TRIGGER_REFRESH_KEY, true, THIRTY_SECONDS)
                expirableLocalStorage.set(TRIGGER_KEY, t)
                setTriggers(t)
                setIsFresh(true)
            },
            error: (data) => setIsFresh(false),
            catcher: (err) => setIsFresh(false),
        })
    }, [isFresh])

    const mapTriggers = (triggers: Trigger[]) => {
        return triggers.map((t: Trigger) => {
            if ("time" in t.configuration.fields) {
                const time = t.configuration.fields.time.split(":")
                time[0] = (parseInt(time[0]) + (new Date().getTimezoneOffset() / 60) * -1).toString()
                t.configuration.fields.time = time.join(":")
            }

            return t
        })
    }

    return {
        triggers,
        refreshTriggers: () => setIsFresh(false),
        triggerByUuid: (uuid: string) => triggers.find(t => t.uuid === uuid),
    }
}
