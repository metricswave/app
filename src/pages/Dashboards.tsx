import SectionContainer from "../components/sections/SectionContainer"
import PageTitle from "../components/sections/PageTitle"
import React, {useState} from "react"
import {useTriggersState} from "../storage/Triggers"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"
import InputFieldBox from "../components/form/InputFieldBox"
import DropDownSelectFieldBox from "../components/form/DropDownSelectFieldBox"
import {calculateDate, Period} from "../types/Period"
import {AddWidget} from "../components/dashboard/AddWidget"
import {Dashboard, DashboardItem, useDashboardsState} from "../storage/Dasboard"
import {CheckIcon, TrashIcon} from "@radix-ui/react-icons"
import DashboardDropDownField from "../components/dashboard/DashboardDropDownField"
import {CopyButtonIcon} from "../components/form/CopyButton"

export function Dashboards() {
    const {
        dashboards,
        addWidgetToDashboard,
        removeWidgetFromDashboard,
        updateDashboard,
        publicDashboardPath,
    } = useDashboardsState()
    const {triggerByUuid} = useTriggersState()
    const [period, setPeriod] = useState<Period>("daily")
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [dashboardIndex, setDashboardIndex] = useState<number>(0)
    const [removeConfirm, setRemoveConfirm] = useState<string>("")
    const setPeriodAndDate = (period: Period) => {
        setDate(calculateDate(period, undefined))
        setPeriod(period)
    }
    const dateFieldType = period === "monthly" ? "month" : "date"
    let addButtonSize = "w-full"
    if (dashboards[dashboardIndex] !== undefined && dashboards[dashboardIndex].items.length > 0) {
        addButtonSize = dashboards[dashboardIndex].items.length % 2 === 0 ? "w-full md:w-1/2" : "w-full"
    }
    const [publicDashboard, setPublicDashboard] = useState<boolean>(dashboards[dashboardIndex].public ?? false)
    const [changedToPublic, setChangedToPublic] = useState<boolean>(false)

    const removeWidget = (dashboardIndex: number, widgetIndex: number) => {
        const removeConfirmKey = `${dashboardIndex}-${widgetIndex}`
        if (removeConfirm !== removeConfirmKey) {
            setRemoveConfirm(removeConfirmKey)
            return
        }

        removeWidgetFromDashboard(dashboardIndex, widgetIndex)
        setRemoveConfirm("")
    }

    const handleDashboardUpdate = (dashboardIndex: number, fields: Partial<Dashboard>) => {
        if (fields.public !== undefined && fields.public && !dashboards[dashboardIndex].public) {
            setChangedToPublic(true)
        }

        updateDashboard(dashboardIndex, fields)
    }

    return <>
        <SectionContainer size={"big"}>
            <div className="flex flex-row space-y-4 justify-between items-center">
                <PageTitle title={"Dashboards"}/>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 justify-end pt-4">
                <div className="flex-grow w-full">
                    <DashboardDropDownField
                        updateDashboard={(dashboard, title, isPublic) => {
                            handleDashboardUpdate(dashboardIndex, {name: title, public: isPublic})
                        }}
                        activeDashboard={dashboards[dashboardIndex]}
                        value={dashboardIndex.toString()}
                        options={dashboards.map((dashboard, index) => ({
                            value: index.toString(),
                            label: dashboard.name,
                        }))}
                        setValue={(value) => {
                            setDashboardIndex(parseInt(value as string))
                        }}
                        label="Dashboard"
                        name="dashboard"
                    />
                </div>

                <div className="flex flex-col w-full sm:w-auto sm:flex-row flex-grow sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="flex-grow">
                        <InputFieldBox
                            setValue={setDate}
                            label="Date"
                            type={dateFieldType}
                            name="date"
                            placeholder={"Date"}
                            value={date}
                        />
                    </div>

                    <DropDownSelectFieldBox
                        className="min-w-[150px] flex-grow"
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

            {changedToPublic && <div>
                <div className="p-4 bg-green-100 border border-green-200 dark:bg-green-800/20 dark:border-green-800/50">
                    <div className=" flex flex-row gap-2 items-center justify-between">
                        <p className="text-mauve12 text-sm leading-[19px] font-bold">Share your dashboard!</p>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="max-w-full truncate text-xs select-all">{publicDashboardPath(dashboards[dashboardIndex])}</div>
                            <div className="cursor-pointer rounded-sm hover:bg-zinc-100 smooth p-1">
                                <CopyButtonIcon textToCopy={publicDashboardPath(dashboards[dashboardIndex])}/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>}
        </SectionContainer>

        {dashboards[dashboardIndex] !== undefined && <SectionContainer size={"extra-big"}>
            <div className="-mx-2.5 pb-64">
                {dashboards[dashboardIndex].items.map(({eventUuid, title, size, type, parameter}, key) => {
                    const trigger = triggerByUuid(eventUuid)
                    const confirmed = removeConfirm === `${dashboardIndex}-${key}`

                    if (trigger === undefined) {
                        return null
                    }

                    return (
                        <div
                            key={key}
                            className={[
                                "relative group float-left p-2.5",
                                (size === "base" ? "w-full md:w-1/2" : "w-full"),
                            ].join(" ")}
                        >
                            <div
                                title={"Remove widget"}
                                className={[
                                    "absolute right-4 top-4 rounded-sm cursor-pointer opacity-0 group-hover:opacity-25 text-lg group-hover:hover:opacity-100 hover:text-red-500 smooth p-3",
                                    confirmed ? "bg-red-200 dark:bg-red-700/30" : "bg-zinc-100 dark:bg-zinc-700",
                                ].join(" ")}
                                onClick={() => removeWidget(dashboardIndex, key)}
                            >
                                {confirmed && <CheckIcon className="w-4 h-4"/>}
                                {!confirmed && <TrashIcon className="w-4 h-4"/>}
                            </div>

                            {type === "stats" &&
                                <TriggerStats trigger={trigger} title={title} defaultView={period} hideViewSwitcher/>}
                            {type === "parameter" &&
                                <TriggerParamsStats
                                    trigger={trigger}
                                    defaultParameter={parameter}
                                    title={title}
                                    defaultPeriod={period}
                                    defaultDate={date}
                                    hideFilters
                                />}
                        </div>
                    )
                })}

                <AddWidget
                    defaultStep={
                        dashboards[dashboardIndex] === undefined || dashboards[dashboardIndex].items.length === 0 ?
                            "selecting" :
                            "idle"
                    }
                    addButtonSize={addButtonSize}
                    addWidgetToDashboard={(item: DashboardItem) => {
                        addWidgetToDashboard(dashboardIndex, item)
                    }}
                />
            </div>
        </SectionContainer>}
    </>
}
