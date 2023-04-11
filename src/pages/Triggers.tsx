import React from "react"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"
import {DialogComponent} from "../components/dialog/DialogComponent"
import TriggersAdd from "../components/triggers_add/TriggersAdd"

export default function Triggers() {
    return (
            <SectionContainer>
                <PageTitle title="Triggers"/>

                <DialogComponent buttonText="Add Trigger">
                    <TriggersAdd/>
                </DialogComponent>
            </SectionContainer>
    )
}
