import React from "react"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"
import {DialogComponent} from "../components/dialog/DialogComponent"
import TriggersAdd from "../components/triggers_add/TriggersAdd"
import {useTriggersState} from "../storage/Triggers"
import {useTriggerTypesState} from "../storage/TriggerTypes"
import {NoLinkButton} from "../components/buttons/LinkButton"

export default function Triggers() {
    const {getTriggerType} = useTriggerTypesState()
    const {triggers, refreshTriggers} = useTriggersState()

    return (
            <SectionContainer>
                <PageTitle title="Triggers"/>

                <div className="flex flex-col space-y-6">
                    {triggers.map((trigger) => {
                        const triggerType = getTriggerType(trigger.trigger_type_id)
                        return (
                                <div key={trigger.id}
                                     className="border soft-border rounded-sm p-4 flex flex-col space-y-4">
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

                                            <p className="text-sm">{trigger.content}</p>

                                            {triggerType !== undefined &&
                                                    <div className="flex flex-row items-center space-x-2 mt-4 w-full text-sm">
                                                        <img src={`/images/trigger-types/${triggerType.icon}`}
                                                             alt={triggerType.name}
                                                             className="w-4 h-4 rounded-sm"/>
                                                        <div className="">{triggerType.name}</div>
                                                    </div>
                                            }
                                        </div>

                                    </div>

                                </div>
                        )
                    })}
                </div>

                <DialogComponent button={
                    <div className="border soft-border rounded-sm p-4 flex flex-col space-y-4 items-center hover:bg-[var(--background-50-color)] smooth cursor-pointer">
                        <NoLinkButton text="Add trigger"/>
                    </div>
                }>
                    <TriggersAdd onLastStep={refreshTriggers}/>
                </DialogComponent>
            </SectionContainer>
    )
}
