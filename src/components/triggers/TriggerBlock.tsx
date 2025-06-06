import React from "react"
import {Trigger} from "../../types/Trigger"
import BlockContainer from "../sections/BlockContainer"
import {TriggerType} from "../../types/TriggerType"
import ReactMarkdown from "react-markdown"
import {triggerWebhookReadableType, webhookTriggerTypeIcon} from "../../storage/TriggerWebhookTypeIcon"

type Props = {
    trigger: Trigger,
    triggerType: TriggerType | undefined,
    onClick: (uuid: string) => void,
}

export default function TriggerBlock({trigger, triggerType, onClick: click}: Props) {

    return (
        <BlockContainer
            key={trigger.id}
            onClick={() => click(trigger.uuid)}
            className="border soft-border rounded-sm p-4 flex flex-col space-y-4 cursor-pointer"
        >

            <div className="flex flex-row space-x-4 items-start">

                <div>
                    <div className="text-2xl w-14 h-14 inline-flex items-center justify-center bg-[var(--background-50-color)] border border-[var(--background-100-color)] rounded-sm">
                        {trigger.emoji}
                    </div>
                </div>

                <div className="w-full">
                    <h3 className="font-bold mb-2">
                        {trigger.title}
                    </h3>

                    <div className="prose-sm break-all dark:prose-invert prose-p:my-0.5">
                        <ReactMarkdown>
                            {trigger.content.replaceAll("\n", "\n\n")}
                        </ReactMarkdown>
                    </div>

                    <div className="flex flex-row items-center space-x-2 mt-4 w-full text-sm opacity-80">
                        {webhookTriggerTypeIcon(trigger.configuration.type ?? "custom")}
                        <div className="">{triggerWebhookReadableType(trigger.configuration.type ?? "custom")}</div>
                    </div>
                </div>

            </div>

        </BlockContainer>
    )
}
