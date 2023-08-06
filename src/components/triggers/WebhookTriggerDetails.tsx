import React from "react"
import {LinkButton} from "../buttons/LinkButton"
import {app} from "../../config/app"
import InputFieldBox from "../form/InputFieldBox"
import CopyButton from "../form/CopyButton"
import {Trigger} from "../../types/Trigger"
import {visitSnippet} from "../../storage/Triggers"
import TextareaFieldBox from "../form/TextareaFieldBox"

export function WebhookTriggerDetails({trigger}: { trigger: Trigger }) {
    const query = (trigger.configuration.fields.parameters as string[])
        .map((param) => `${param}={value}`)
        .join("&")
    const url = `${app.webhooks}/${trigger.uuid}?${query}`
    const snippet = visitSnippet(trigger)

    if (trigger.configuration.type === "visits") {
        return (<div className="flex flex-col gap-3">
                <p className="text-sm md:text-base">
                    Monitor your traffic with this event, just add the following script on all your
                    pages. <LinkButton target="_blank"
                                       href={`${app.web}/documentation/tracking/events`}
                                       text="Here you can find more info about webhooks."/>
                </p>

                <div className="text-sm md:text-base">
                    <TextareaFieldBox
                        value={snippet}
                        setValue={() => null}
                        label="Script"
                        name="script"
                        placeholder=""
                        height={"h-[90px]"}
                        disabled
                    />

                    <CopyButton textToCopy={snippet} className="w-full mt-2"/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm md:text-base">
                To trigger this event you can just call the next URL from your
                application. <LinkButton target="_blank"
                                         href={`${app.web}/documentation/tracking/events`}
                                         text="Here you can find more info about webhooks."/>
            </p>

            <div className="text-sm md:text-base">
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
        </div>
    )
}
