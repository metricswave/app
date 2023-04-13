import React from "react"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"
import {DialogComponent} from "../components/dialog/DialogComponent"
import TriggersAdd from "../components/triggers_add/TriggersAdd"
import {useTriggersState} from "../storage/Triggers"

export default function Triggers() {
    const {triggers, refreshTriggers} = useTriggersState()

    return (
            <SectionContainer>
                <PageTitle title="Triggers"/>

                <div>
                    {triggers.map((trigger) => (
                            <div key={trigger.id}>
                                {trigger.title}
                            </div>
                    ))}
                </div>

                <DialogComponent buttonText="Add Trigger">
                    <TriggersAdd onLastStep={refreshTriggers}/>
                </DialogComponent>
            </SectionContainer>
    )
}
