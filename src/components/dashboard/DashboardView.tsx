import React from "react"
import SectionContainer from "../sections/SectionContainer"
import {EditWidgetsIcon} from "../icons/EditWidgetsIcon"
import {AddWidget} from "./AddWidget"
import DashboardWidget from "./DashboardWidget"
import {PeriodConfiguration} from "../../types/Period"
import {Dashboard, DashboardItem} from "../../types/Dashboard";

export class DashboardView extends React.Component<{
    dashboards: Dashboard[],
    dashboardIndex: number,
    addButtonSize: string,
    period: PeriodConfiguration,
    compareWithPrevious: boolean,
    date: string,
    addWidgetToDashboard: (item: DashboardItem) => void
}> {
    render() {
        return <SectionContainer size={"extra-big"}>
            <div className="flex flex-row-reverse py-1 px-2">
                <a
                    className="flex flex-row gap-2 items-center uppercase text-xs opacity-50 hover:opacity-90 smooth-all"
                    href={`/edit/${this.props.dashboardIndex}`}
                >
                    <EditWidgetsIcon/>
                    Modify Widgets
                </a>
            </div>

            <div className="-mx-2.5 pb-64 grid gap-4 grid-cols-1 md:grid-cols-2 ">
                {this.props.dashboards[this.props.dashboardIndex].items.map((
                    {eventUuid, title, size, type, parameter}, index,
                ) => (
                    <DashboardWidget
                        eventUuid={eventUuid}
                        title={title}
                        size={size as "base" | "large"}
                        type={type}
                        period={this.props.period}
                        compareWithPrevious={this.props.compareWithPrevious}
                        date={this.props.date}
                        parameter={parameter}
                        key={index}
                    />
                ))}

                <AddWidget
                    defaultStep={
                        this.props.dashboards[this.props.dashboardIndex] === undefined || this.props.dashboards[this.props.dashboardIndex].items.length === 0 ?
                            "selecting" :
                            "idle"
                    }
                    addButtonSize={this.props.addButtonSize}
                    addWidgetToDashboard={this.props.addWidgetToDashboard}
                />
            </div>
        </SectionContainer>
    }
}
