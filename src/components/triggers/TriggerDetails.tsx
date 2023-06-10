import {Trigger, TriggerTypeId} from "../../types/Trigger"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import {ReactElement} from "react"
import DeleteButton from "../form/DeleteButton"
import InputFieldBox from "../form/InputFieldBox"
import {app} from "../../config/app"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {LinkButton} from "../buttons/LinkButton"
import CopyButton from "../form/CopyButton"
import {useNavigate} from "react-router-dom"
import PageTitle from "../sections/PageTitle"
import {Pencil1Icon} from "@radix-ui/react-icons"
import SecondaryButton from "../form/SecondaryButton"

type Props = {
    trigger: Trigger
    onDeleted: () => void
}

export default function TriggerDetails({trigger, onDeleted: deleted}: Props) {
    const navigate = useNavigate()
    const {getTriggerTypeById} = useTriggerTypesState()
    const triggerType = getTriggerTypeById(trigger.trigger_type_id)!

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
                const query = trigger.configuration.fields.parameters
                    .map((param) => `${param}={value}`)
                    .join("&")
                const url = `${app.webhooks}/${trigger.uuid}?${query}`

                return (<div className="flex flex-col space-y-4">
                    <p>Call or open the next URL and you will receive a notification instantly.</p>

                    <p className="pb-1">
                        <LinkButton target="_blank"
                                    href={`${app.web}/documentation/triggers/webhooks`}
                                    text="Here you can find more info about webhooks."/>
                    </p>

                    <div>
                        <InputFieldBox
                            value={url}
                            setValue={() => null}
                            label="Webhook Path"
                            name="webhook_path"
                            placeholder=""
                            disabled
                        />

                        <CopyButton textToCopy={url} className="w-full mt-2"/>
                    </div>

                </div>)
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
                <PageTitle title={`${trigger.emoji} ${trigger.title}`} description={triggerType.name}/>
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
