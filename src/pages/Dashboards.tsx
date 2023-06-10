import SectionContainer from "../components/sections/SectionContainer"
import PageTitle from "../components/sections/PageTitle"
import {useState} from "react"
import {useTriggersState} from "../storage/Triggers"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"
import InputFieldBox from "../components/form/InputFieldBox"
import DropDownSelectFieldBox from "../components/form/DropDownSelectFieldBox"
import {Period} from "../types/Period"
import {AddWidget} from "../components/dashboard/AddWidget"
import {DashboardItem, useDashboardsState} from "../storage/Dasboard"

export function Dashboards() {
    const {dashboards, addWidgetToDashboard} = useDashboardsState()
    const {triggerByUuid} = useTriggersState()
    const [period, setPeriod] = useState<Period>("daily")
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [dashboardIndex, setDashboardIndex] = useState<number>(0)
    const setPeriodAndDate = (period: Period) => {
        setDate(
            period === "daily" ?
                new Date().toISOString().split("T")[0] :
                new Date().toISOString().split("T")[0].slice(0, 7),
        )
        setPeriod(period)
    }
    const addButtonSize = dashboards[dashboardIndex].items.length % 2 === 0 ? "w-1/2" : "w-full"

    return <>
        <SectionContainer size={"big"}>
            <PageTitle title={"Dashboards"}/>

            <div className="flex flex-row items-center space-x-3 justify-end pt-4">
                {/*<div className="flex-grow">*/}
                {/*    <DropDownSelectFieldBox*/}
                {/*        value={dashboardIndex.toString()}*/}
                {/*        options={dashboards.map((dashboard, index) => ({*/}
                {/*            value: index.toString(),*/}
                {/*            label: dashboard.name,*/}
                {/*        }))}*/}
                {/*        setValue={(value) => {*/}
                {/*            setDashboardIndex(parseInt(value as string))*/}
                {/*        }}*/}
                {/*        label="Dashboard"*/}
                {/*        name="dashboard"*/}
                {/*    />*/}
                {/*</div>*/}

                <div className="flex flex-row flex-grow items-center justify-end space-x-3">
                    <div className="flex-grow">
                        <InputFieldBox
                            setValue={setDate}
                            label="Date"
                            type={period === "daily" ? "date" : "month"}
                            name="date"
                            placeholder={"Date"}
                            value={date}
                        />
                    </div>

                    <DropDownSelectFieldBox
                        className="flex-grow"
                        value={period}
                        options={[
                            {
                                value: "daily",
                                label: "Daily",
                            },
                            {
                                value: "monthly",
                                label: "Monthly",
                            },
                        ]}
                        setValue={(value) => {
                            setPeriodAndDate(value as Period)
                        }}
                        label="Period"
                        name="period"
                    />
                </div>
            </div>
        </SectionContainer>

        <SectionContainer size={"extra-big"}>
            <div className="-mx-2.5 pb-64">
                {dashboards[dashboardIndex].items.map(({eventUuid, title, size, type}, key) => {
                    const trigger = triggerByUuid(eventUuid)!
                    return (
                        <div
                            key={key}
                            className={[
                                "float-left p-2.5",
                                (size === "base" ? "w-1/2" : "w-full"),
                            ].join(" ")}
                        >
                            {type === "stats" &&
                                <TriggerStats trigger={trigger} title={title} defaultView={period} hideViewSwitcher/>}
                            {type === "parameter" &&
                                <TriggerParamsStats
                                    trigger={trigger}
                                    title={title}
                                    defaultPeriod={period}
                                    defaultDate={date}
                                    hideFilters
                                />}
                        </div>
                    )
                })}

                <AddWidget
                    addButtonSize={addButtonSize}
                    addWidgetToDashboard={(item: DashboardItem) => {
                        addWidgetToDashboard(dashboardIndex, item)
                    }}
                />
            </div>
        </SectionContainer>
    </>
}
