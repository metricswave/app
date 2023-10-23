import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, THIRTY_SECONDS} from "../helpers/ExpirableLocalStorage"
import {Trigger} from "../types/Trigger"
import {TeamId} from "../types/Team";
import {useAuthContext} from "../contexts/AuthContext";

const TIME_FIELDS: string[] = ["time", "arrival_time"]

export function visitSnippet(trigger: Trigger, formatted = false): string {
    if (formatted) {
        return `<script defer 
  event-uuid="${trigger.uuid}" 
  src="https://tracker.metricswave.com/js/visits.js"
></script>`
    }

    return `<script defer event-uuid="${trigger.uuid}" src="https://tracker.metricswave.com/js/visits.js"></script>`
}

export function visitGoogleTagManagerSnippet(trigger: Trigger, formatted = false): string {
    if (formatted) {
        return `<script>
  var script = document.createElement('script');
  script.defer = true;
  script.setAttribute(
      'event-uuid', 
      '${trigger.uuid}'
  )
  script.src = "https://tracker.metricswave.com/js/visits.js";
  document.getElementsByTagName('head')[0].appendChild(script);
</script>`
    }

    return `<script>
  var script = document.createElement('script');
  script.defer = true;
  script.setAttribute('event-uuid', '${trigger.uuid}')
  script.src = "https://tracker.metricswave.com/js/visits.js";
  document.getElementsByTagName('head')[0].appendChild(script);
</script>`
}

export function useTriggersState() {
    const {teamState} = useAuthContext()
    const {currentTeamId} = teamState
    const [loadingTeamTriggers, setLoadingTeamTriggers] = useState<TeamId | false>(false)

    const TRIGGER_KEY = () => `nw:${currentTeamId}:triggers`

    const [loadedTriggers, setLoadedTriggers] = useState<boolean>(false)
    const [triggers, setTriggers] = useState<Trigger[]>(
        expirableLocalStorage.get(TRIGGER_KEY(), [], true),
    )

    const reloadTriggers = (force: boolean = false) => {
        if (currentTeamId === null) {
            return
        }

        setTriggers(expirableLocalStorage.get(TRIGGER_KEY(), [], true))

        const isFresh = expirableLocalStorage.get(TRIGGER_KEY(), false)
        if (triggers.length > 0 && isFresh !== false && !force) {
            setTriggers(isFresh)
            setLoadedTriggers(true)
            return
        }

        if (loadingTeamTriggers === currentTeamId && !force) {
            return;
        }

        if (force) {
            setLoadedTriggers(false)
            expirableLocalStorage.set(TRIGGER_KEY(), [], THIRTY_SECONDS)
            setTriggers([])
        }

        setLoadingTeamTriggers(currentTeamId)

        fetchAuthApi<{ triggers: Trigger[] }>(`/${currentTeamId}/triggers`, {
            success: (data) => {
                const t = mapTriggers(data.data.triggers)
                expirableLocalStorage.set(TRIGGER_KEY(), t, THIRTY_SECONDS)
                setTriggers(t)
                setLoadedTriggers(true)
                setLoadingTeamTriggers(false)
            },
            finally: () => {
                setLoadingTeamTriggers(false)
            }
        })
    }

    useEffect(() => reloadTriggers(), [currentTeamId])

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
            reloadTriggers(true)
        },
        triggerByUuid: (uuid: string) => triggers.find(t => t.uuid === uuid),
    }
}
