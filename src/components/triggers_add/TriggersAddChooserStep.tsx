import {AllWebhookTriggers, WebhookTriggerType} from "../../types/TriggerType"
import React, {Dispatch, SetStateAction} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import {DialogHeader} from "../dialog/DialogHeader"
import BlockContainer from "../sections/BlockContainer"
import {triggerWebhookReadableType, webhookTriggerTypeIcon} from "../../storage/TriggerWebhookTypeIcon"

type TriggersAddChooseStepProps = {
    chooser: Dispatch<SetStateAction<WebhookTriggerType | null>>
}

export default function TriggersAddChooserStep({chooser}: TriggersAddChooseStepProps) {
    return (
        <>
            <DialogHeader/>

            <div className="flex flex-row space-x-10 mt-5 sm:mt-0 mb-2 justify-between items-start">
                <div>
                    <Dialog.Title className="font-bold m-0 text-xl">
                        Choose your Event Type
                    </Dialog.Title>

                    <Dialog.Description className="mt-2 mb-6 opacity-70">
                        Choose a event type depending on what do you want to measure.
                    </Dialog.Description>
                </div>
            </div>

            <div className="flex flex-col space-y-6">
                {AllWebhookTriggers.map((triggerType: WebhookTriggerType) => {
                    return (
                        <BlockContainer
                            key={triggerType}
                            onClick={() => {
                                chooser(triggerType)
                            }}
                        >
                            {webhookTriggerTypeDetails(triggerType)}
                        </BlockContainer>
                    )
                })}
            </div>
        </>
    )
}

function webhookTriggerTypeDetails(triggerType: WebhookTriggerType) {
    let description
    if (triggerType === "funnel") {
        description = "Create a funnel event to measure complex registration, sales or onboarding processes, for example."
    } else if (triggerType === "visits") {
        description = "Monitor your website or application traffic automatically measuring visits, unique visits, referrers, more."
    } else if (triggerType === "money_income") {
        description = "Track your income from sales, subscriptions, donations, or any other source of money."
    } else {
        description = "Create a custom event, with the fields you want a measure everything you can imagine."
    }

    return (<>
        <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 items-center">
                {webhookTriggerTypeIcon(triggerType)}
                <h3 className="font-bold">{triggerWebhookReadableType(triggerType)}</h3>
            </div>
            <p className="text-sm sm:text-base opacity-80">{description}</p>
        </div>
    </>)
}
