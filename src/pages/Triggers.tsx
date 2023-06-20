import React from "react"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"
import {DialogComponent} from "../components/dialog/DialogComponent"
import TriggersAdd from "../components/triggers_add/TriggersAdd"
import {useTriggersState} from "../storage/Triggers"
import {NoLinkButton} from "../components/buttons/LinkButton"
import TriggerBlock from "../components/triggers/TriggerBlock"
import {useNavigate} from "react-router-dom"
import {useTriggerTypesState} from "../storage/TriggerTypes"
import eventTracker from "../helpers/EventTracker"
import {useUserServicesState} from "../storage/UserServices"
import TriggersPageEmptyState from "./TriggersPageEmptyState"

export default function Triggers() {
    useUserServicesState()
    const navigate = useNavigate()
    const {triggers, refreshTriggers} = useTriggersState()
    const {getTriggerTypeById} = useTriggerTypesState()

    if (triggers.length === 0) {
        return <TriggersPageEmptyState>
            {/* Add triggers dialog */}
            <DialogComponent onOpenChange={status => {
                if (status) {
                    eventTracker.track("0555d93b-350a-41b4-800c-8741b9566bb0", {step: 1})
                }
            }} button={
                <div className="border soft-border rounded-sm p-4 flex flex-col space-y-4 items-center hover:bg-[var(--background-50-color)] smooth cursor-pointer">
                    <NoLinkButton text="Add trigger"/>
                </div>
            }>
                <TriggersAdd onLastStep={() => {
                    refreshTriggers()
                    eventTracker.track("0555d93b-350a-41b4-800c-8741b9566bb0", {step: 2})
                }}/>
            </DialogComponent>
        </TriggersPageEmptyState>
    }

    return (
        <SectionContainer>
            <PageTitle title="Events"/>

            {/* Add triggers dialog */}
            <DialogComponent onOpenChange={status => {
                if (status) {
                    eventTracker.track("0555d93b-350a-41b4-800c-8741b9566bb0", {step: 1})
                }
            }} button={
                <div className="border soft-border rounded-sm p-4 flex flex-col space-y-4 items-center hover:bg-[var(--background-50-color)] smooth cursor-pointer">
                    <NoLinkButton text="Add Event"/>
                </div>
            }>
                <TriggersAdd onLastStep={() => {
                    eventTracker.track("0555d93b-350a-41b4-800c-8741b9566bb0", {step: 2})
                    refreshTriggers()
                }}/>
            </DialogComponent>

            <div className="flex flex-col space-y-6">
                {triggers.map((trigger) => (
                    <TriggerBlock
                        trigger={trigger}
                        triggerType={getTriggerTypeById(trigger.trigger_type_id)}
                        key={trigger.id}
                        onClick={() => {
                            navigate(`/events/${trigger.uuid}`)
                        }}
                    />
                ))}
            </div>

        </SectionContainer>
    )
}
