import React from "react"
import * as Tabs from "@radix-ui/react-tabs"
import {LinkButton} from "../buttons/LinkButton"
import {app} from "../../config/app"
import InputFieldBox from "../form/InputFieldBox"
import CopyButton from "../form/CopyButton"
import TextareaFieldBox from "../form/TextareaFieldBox"
import {Trigger} from "../../types/Trigger"

export function WebhookTriggerDetails({trigger}: { trigger: Trigger }) {
    const query = (trigger.configuration.fields.parameters as string[])
        .map((param) => `${param}={value}`)
        .join("&")
    const url = `${app.webhooks}/${trigger.uuid}?${query}`
    const snippet = `<script defer event-uuid="${trigger.uuid}" src="https://metricswave.com/js/visits.js"></script>`

    return (
        <Tabs.Root
            className="flex flex-col w-full border soft-border rounded-sm"
            defaultValue="tab1"
        >
            <Tabs.List className="shrink-0 flex border-b soft-border" aria-label="Manage your account">
                <Tabs.Trigger
                    className="px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-blue-800 dark:hover:text-blue-200 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current  outline-none cursor-default "
                    value="tab1"
                >
                    Event
                </Tabs.Trigger>
                <Tabs.Trigger
                    className="px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-blue-800 dark:hover:text-blue-200 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-default"
                    value="tab2"
                >
                    Visits
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
                className="grow p-5 outline-none flex flex-col gap-4 data-[state=inactive]:hidden"
                value="tab1"
            >
                <p>
                    To trigger this event you can just call the next URL from your
                    application. <LinkButton target="_blank"
                                             href={`${app.web}/documentation/tracking/events`}
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
            </Tabs.Content>
            <Tabs.Content
                className="grow p-5 outline-none flex flex-col gap-4 data-[state=inactive]:hidden"
                value="tab2"
            >
                <p>
                    If you want to monitor your traffic with this event just add the following script on all your
                    pages. <LinkButton target="_blank"
                                       href={`${app.web}/documentation/tracking/events`}
                                       text="Here you can find more info about webhooks."/>
                </p>

                <div>
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
            </Tabs.Content>
        </Tabs.Root>
    )
}
