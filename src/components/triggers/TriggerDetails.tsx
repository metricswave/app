import {Trigger, TriggerTypeId} from "../../types/Trigger"
import {ReactElement} from "react"
import DeleteButton from "../form/DeleteButton"
import {app} from "../../config/app"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {LinkButton} from "../buttons/LinkButton"
import {CopyButtonIcon} from "../form/CopyButton"
import {useNavigate} from "react-router-dom"
import {Pencil1Icon} from "@radix-ui/react-icons"
import SecondaryButton from "../form/SecondaryButton"
import {WebhookTriggerDetails} from "./WebhookTriggerDetails"

type Props = {
    trigger: Trigger
    onDeleted: () => void
}

export default function TriggerDetails({trigger, onDeleted: deleted}: Props) {
    const navigate = useNavigate()

    const listFormatter = new Intl.ListFormat("en")

    const handleDelete = async () => {
        await fetchAuthApi(`/triggers/${trigger.uuid}`, {
            method: "DELETE",
            success: deleted,
            error: () => null,
            catcher: () => null,
        })
    }

    const triggerInstructions = (trigger: Trigger): ReactElement => {
        switch (trigger.trigger_type_id) {
            case TriggerTypeId.CalendarTimeToLeave:
                return (<>
                    <p>
                        You will receive a notification for all your events with a location. The notification will be
                        sent at time to leave to arrive at from {trigger.configuration.fields.origin}.
                    </p>

                    <p className="pt-2">
                        <LinkButton href={`${app.web}/documentation/triggers/calendar-time-to-leave`}
                                    target="_blank"
                                    text="More info about Calendar Time To Leave triggers."/>
                    </p>
                </>)
            case TriggerTypeId.TimeToLeave:
                return (<>
                    <p>
                        You will receive a notification
                        all {listFormatter.format(trigger.configuration.fields.weekdays)} at time to leave to arrive at
                        destination 15 minutes before {trigger.configuration.fields.arrival_time}.
                    </p>

                    <p className="pt-2">
                        <LinkButton href={`${app.web}/documentation/triggers/time-to-leave`}
                                    target="_blank"
                                    text="More info about Time To Leave triggers."/>
                    </p>
                </>)
            case TriggerTypeId.OnTime:
                return (<>
                    <p>
                        You will receive a notification
                        all {listFormatter.format(trigger.configuration.fields.weekdays)} at {trigger.configuration.fields.time}.
                    </p>

                    <p className="pt-2">
                        <LinkButton href={`${app.web}/documentation/triggers/on-time`}
                                    target="_blank"
                                    text="More info about On Time triggers."/>
                    </p>
                </>)
            case TriggerTypeId.Webhook:
                return (<WebhookTriggerDetails trigger={trigger}/>)
            case TriggerTypeId.WeatherSummary:
                return (<>
                    <p>
                        You will receive a notification
                        all {listFormatter.format(trigger.configuration.fields.weekdays)} at {trigger.configuration.fields.time} with
                        a summary about that days weather.
                    </p>

                    <p className="pt-2">
                        <LinkButton href={`${app.web}/documentation/triggers/weather-summary`}
                                    target="_blank"
                                    text="More info about Weather Summary triggers."/>
                    </p>
                </>)
            default:
                return (<></>)
        }
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start justify-center sm:items-center sm:justify-between">
                <div className="flex flex-col space-y-2 mb-4k">
                    <h1 className="text-lg font-bold">{`${trigger.emoji} ${trigger.title}`}</h1>
                    <div className="text-sm opacity-70 flex flex-row gap-3 items-center">
                        <div className="pt-[2px]"><strong>UUID:</strong> {trigger.uuid}</div>
                        <CopyButtonIcon textToCopy={trigger.uuid}/>
                    </div>
                </div>
                <div className="flex flex-row space-x-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <SecondaryButton onClick={() => navigate(`/events/${trigger.uuid}/edit`)}
                                     className="w-full sm:w-auto flex flex-row items-center space-x-3">
                        <Pencil1Icon/> <span className="sm:hidden">Edit</span>
                    </SecondaryButton>
                    <DeleteButton justIcon onClick={handleDelete}/>
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="py-2">
                    {triggerInstructions(trigger)}
                </div>
            </div>
        </>
    )
}
