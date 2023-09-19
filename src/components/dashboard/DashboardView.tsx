import React from "react"
import SectionContainer from "../sections/SectionContainer"
import {EditWidgetsIcon} from "../icons/EditWidgetsIcon"
import {AddWidget} from "./AddWidget"
import DashboardWidget from "./DashboardWidget"
import {PeriodConfiguration} from "../../types/Period"
import {Dashboard, DashboardItem} from "../../types/Dashboard";
import {useTriggersState} from "../../storage/Triggers";

export function DashboardView(props: {
    dashboards: Dashboard[],
    dashboardIndex: number,
    addButtonSize: string,
    period: PeriodConfiguration,
    compareWithPrevious: boolean,
    date: string,
    addWidgetToDashboard: (item: DashboardItem) => void
}) {
    const {triggerByUuid} = useTriggersState()

    return <SectionContainer size={"extra-big"}>
        <div className="flex flex-row-reverse py-1 px-2">
            <a
                className="flex flex-row gap-2 items-center uppercase text-xs opacity-50 hover:opacity-90 smooth-all"
                href={`/edit/${props.dashboardIndex}`}
            >
                <EditWidgetsIcon/>
                Modify Widgets
            </a>
        </div>

        <div className="-mx-2.5 pb-64 grid gap-4 grid-cols-1 md:grid-cols-2 ">
            {props.dashboards[props.dashboardIndex].items.map((
                {eventUuid, title, size, type, parameter}, index,
            ) => {
                const trigger = triggerByUuid(eventUuid)

                if (trigger === undefined) {
                    return null
                }

                return (<DashboardWidget
                    trigger={trigger}
                    title={title}
                    size={size as "base" | "large"}
                    type={type}
                    period={props.period}
                    compareWithPrevious={props.compareWithPrevious}
                    date={props.date}
                    parameter={parameter}
                    key={index + eventUuid + parameter}
                />)
            })}

            <AddWidget
                defaultStep={
                    props.dashboards[props.dashboardIndex] === undefined || props.dashboards[props.dashboardIndex].items.length === 0 ?
                        "selecting" :
                        "idle"
                }
                addButtonSize={props.addButtonSize}
                addWidgetToDashboard={props.addWidgetToDashboard}
            />
        </div>
    </SectionContainer>
}
