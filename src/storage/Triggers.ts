import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, THIRTY_SECONDS} from "../helpers/ExpirableLocalStorage"
import {Trigger} from "../types/Trigger"
import {TeamId} from "../types/Team";
import {useAuthContext} from "../contexts/AuthContext";

const TIME_FIELDS: string[] = ["time", "arrival_time"]
let loadingTeamTriggers: TeamId | false = false

export function visitSnippet(trigger: Trigger, formatted = false): string {
    if (formatted) {
        return `<script defer 
  event-uuid="${trigger.uuid}" 
  src="https://tracker.metricswave.com/js/visits.js"
></script>`
    }

    return `<script defer event-uuid="${trigger.uuid}" src="https://tracker.metricswave.com/js/visits.js"></script>`
}

export function useTriggersState() {
    const {currentTeamId} = useAuthContext().teamState

    const TRIGGER_KEY: string = `nw:${currentTeamId}:triggers`
    const TRIGGER_REFRESH_KEY: string = `nw:${currentTeamId}:triggers:refresh:v2`

    const [loadedTriggers, setLoadedTriggers] = useState<boolean>(false)
    const [isFresh, setIsFresh] = useState<true | false>(
        expirableLocalStorage.get(TRIGGER_REFRESH_KEY, false),
    )
    const [triggers, setTriggers] = useState<Trigger[]>(
        expirableLocalStorage.get(TRIGGER_KEY, []),
    )

    useEffect(() => {
        if (currentTeamId === null) {
            return
        }

        if (triggers.length > 0 && isFresh) {
            setLoadedTriggers(true)
            return
        }

        if (loadingTeamTriggers === currentTeamId) {
            return;
        }

        loadingTeamTriggers = false

        fetchAuthApi<{ triggers: Trigger[] }>(`/${currentTeamId}/triggers`, {
            success: (data) => {
                const t = mapTriggers(data.data.triggers)
                expirableLocalStorage.set(TRIGGER_REFRESH_KEY, true, THIRTY_SECONDS)
                expirableLocalStorage.set(TRIGGER_KEY, t)
                setTriggers(t)
                setIsFresh(true)
                setLoadedTriggers(true)
                loadingTeamTriggers = false
            },
            error: (data) => {
                setIsFresh(false)
                loadingTeamTriggers = false
            },
            catcher: (err) => {
                setIsFresh(false)
                loadingTeamTriggers = false
            },
        })
    }, [isFresh, currentTeamId])

    const mapTriggers = (triggers: Trigger[]) => {
        return triggers
            .map((t: Trigger) => {
                TIME_FIELDS.forEach((field) => {
                    if (field in t.configuration.fields) {
                        const time = t.configuration.fields[field].split(":")
                        let hour = (parseInt(time[0]) + (new Date().getTimezoneOffset() / 60) * -1)

                        if (hour < 0) {
                            hour = 24 + hour
                        } else if (hour > 23) {
                            hour = hour - 24
                        }

                        time[0] = hour.toString()
                        if (time[0].length === 1) {
                            time[0] = "0" + time[0]
                        }

                        t.configuration.fields[field] = time.join(":")
                    }
                })

                return t
            })
    }

    return {
        triggers,
        loadedTriggers,
        refreshTriggers: () => {
            expirableLocalStorage.delete(TRIGGER_REFRESH_KEY)
            setIsFresh(false)
        },
        triggerByUuid: (uuid: string) => triggers.find(t => t.uuid === uuid),
    }
}
