import {Trigger} from "../../types/Trigger"
import {TriggerStats} from "./TriggerStats"
import SectionContainer from "../sections/SectionContainer"
import {TriggerParamsStats} from "./TriggerParamsStats"
import {TriggerFunnelStats} from "./TriggerFunnelStats"

export default function TriggerAutomaticGraph({trigger}: { trigger: Trigger }) {
    const hasParams = trigger.configuration.fields["parameters"] !== undefined
        && trigger.configuration.fields["parameters"].length > 0

    if (trigger.configuration.type === "funnel") {
        return (
            <SectionContainer size="big">
                <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                    <TriggerFunnelStats title={"Funnel"} trigger={trigger} defaultPeriod={"month"}/>
                </div>
            </SectionContainer>
        )
    }

    return (<>
        <SectionContainer size="big">
            <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                <TriggerStats trigger={trigger} title={"Hits"} defaultPeriod={"month"}/>
            </div>
        </SectionContainer>

        {hasParams && (
            <SectionContainer size="big">
                <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                    <TriggerParamsStats trigger={trigger}/>
                </div>
            </SectionContainer>
        )}
    </>)
}
