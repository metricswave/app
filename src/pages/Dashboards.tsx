import SectionContainer from "../components/sections/SectionContainer"
import PageTitle from "../components/sections/PageTitle"
import {useState} from "react"
import {useTriggersState} from "../storage/Triggers"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"
import InputFieldBox from "../components/form/InputFieldBox"
import DropDownSelectFieldBox from "../components/form/DropDownSelectFieldBox"
import {Period} from "../types/Period"

type Dashboard = {
    id: string
    name: string
    items: Array<{
        eventUuid: string
        title: string
        size: "base" | "large"
    } & (StatItem | ParameterItem)>,
}
type StatItem = {
    type: "stats"
}

type ParameterItem = {
    type: "parameter"
    parameter: string
}

const dashboards: Dashboard[] = [
    {
        id: "1",
        name: "Default",
        items: [
            {
                eventUuid: "fbe17995-b16b-45d5-b33e-7a43b9a41313",
                title: "Landing Visits",
                size: "base",
                type: "stats",
            },
            {
                eventUuid: "f41ff0fd-4475-499c-b086-82d6012bbf16",
                title: "App Visits",
                size: "base",
                type: "stats",
            },
            {
                eventUuid: "fbe17995-b16b-45d5-b33e-7a43b9a41313",
                title: "Landing Visits by Path",
                size: "base",
                type: "parameter",
                parameter: "path",
            },
            {
                eventUuid: "f41ff0fd-4475-499c-b086-82d6012bbf16",
                title: "App Visits by Path",
                size: "base",
                type: "parameter",
                parameter: "path",
            },
        ],
    },
]

export function Dashboards() {
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

    return <>
        <SectionContainer size={"big"}>
            <PageTitle title={"Dashboards"}/>

            <div className="flex flex-row items-center justify-between pt-4">
                <div>
                    Select dashboard
                </div>

                <div className="flex flex-row flex-grow items-center justify-end space-x-3">
                    <div className="w-1/3">
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
                        className="w-1/3"
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
            <div className="-mx-2.5">
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
            </div>
        </SectionContainer>
    </>
}
