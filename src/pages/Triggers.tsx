import React from "react"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"
import {DialogComponent} from "../components/dialog/DialogComponent"
import TriggersAdd from "../components/triggers_add/TriggersAdd"
import {useTriggersState} from "../storage/Triggers"
import {NoLinkButton} from "../components/buttons/LinkButton"
import TriggerBlock from "../components/triggers/TriggerBlock"
import {useParams} from "react-router-dom"
import TriggerDetails from "../components/triggers/TriggerDetails"

export default function Triggers() {
    const [triggerUuid, setTriggerUuid] = React.useState<string | undefined>(
            useParams().triggerUuid as string | undefined,
    )
    const {triggers, refreshTriggers, triggerByUuid} = useTriggersState()


    return (
            <SectionContainer>
                <PageTitle title="Triggers"/>

                <div className="flex flex-col space-y-6">
                    {triggers.map((trigger) => (
                            <TriggerBlock
                                    trigger={trigger}
                                    key={trigger.id}
                                    onClick={setTriggerUuid}
                            />
                    ))}
                </div>

                {/* View trigger dialog */}
                {triggerUuid !== undefined && triggerByUuid(triggerUuid) !== undefined &&
                        <DialogComponent
                                open={true}
                                onOpenChange={(state) => {
                                    if (!state) setTriggerUuid(undefined)
                                }}
                        >
                            <TriggerDetails trigger={triggerByUuid(triggerUuid!)!}/>
                        </DialogComponent>
                }

                {/* Add triggers dialog */}
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
