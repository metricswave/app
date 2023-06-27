import SectionContainer from "../components/sections/SectionContainer"
import PageTitle from "../components/sections/PageTitle"
import React, {useEffect, useState} from "react"
import {useTriggersState} from "../storage/Triggers"
import {calculateDefaultDateForPeriod, DEFAULT_PERIOD, Period, periods, periodsWithSeparators} from "../types/Period"
import {AddWidget} from "../components/dashboard/AddWidget"
import {Dashboard, DashboardItem, useDashboardsState} from "../storage/Dashboard"
import {CheckIcon, ChevronDownIcon, TrashIcon} from "@radix-ui/react-icons"
import DashboardDropDownField from "../components/dashboard/DashboardDropDownField"
import {CopyButtonIcon} from "../components/form/CopyButton"
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {useSearchParams} from "react-router-dom"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function Dashboards() {
    const {
        dashboards,
        addWidgetToDashboard,
        removeWidgetFromDashboard,
        updateDashboard,
        publicDashboardPath,
    } = useDashboardsState()
    const [searchParams, setSearchParams] = useSearchParams()
    const {triggerByUuid} = useTriggersState()
    const [period, setPeriod] = useState<Period>(searchParams.get("period") as Period ?? DEFAULT_PERIOD)
    const periodConfiguration = periods.find(p => p.value === period)!
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [dashboardIndex, setDashboardIndex] = useState<number>(0)
    const [removeConfirm, setRemoveConfirm] = useState<string>("")
    const [compareWithPervious, setCompareWithPervious] = useState<boolean>(false)
    const setPeriodAndDate = (period: Period) => {
        setDate(calculateDefaultDateForPeriod(period))
        setPeriod(period)
    }
    let addButtonSize = "w-full"
    const dashboardsHasLoad = dashboards !== undefined && dashboards.length > 0 && dashboards[dashboardIndex] !== undefined
    if (dashboardsHasLoad) {
        addButtonSize = dashboards[dashboardIndex].items.length % 2 === 0 && dashboards[dashboardIndex].items.length !== 0 ? "" : "md:col-span-2"
    }
    const [changedToPublic, setChangedToPublic] = useState<boolean>(false)

    useEffect(() => setSearchParams({period}), [period])

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

    if (!dashboardsHasLoad) {
        return <>
            <div className="flex flex-col gap-4 items-center animate-pulse justify-center pt-20 sm:pt-44 md:pt-64">
                <CircleArrowsIcon className="animate-spin h-6"/>
                <div>Loading…</div>
            </div>
        </>
    }

    return <>
        <SectionContainer size={"big"}>
            <div className="flex flex-row space-y-4 justify-between items-center">
                <PageTitle title={"Dashboards"}/>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 justify-end pt-4">
                <div className="w-full">
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

                <div className="flex flex-col w-full sm:w-auto sm:flex-row flex-grow sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 min-w-[200px] border soft-border p-2">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <div className="p-2 w-full flex-grow flex flex-row items-center justify-center rounded-sm cursor-pointer hover:bg-zinc-100/90">
                                <div className="w-full whitespace-nowrap pr-4">
                                    {periods.find(p => p.value === period)?.label}
                                </div>

                                <ChevronDownIcon/>
                            </div>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                sideOffset={5}
                                align={"end"}
                            >

                                {periodsWithSeparators.map((p, index) => {
                                    if ("period" in p) {
                                        return (
                                            <DropdownMenu.Item
                                                key={index}
                                                className="group text-[13px] leading-none rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-500"
                                                onSelect={() => {
                                                    setPeriod(p.period)
                                                }}
                                            >
                                                {p.value === period &&
                                                    <CheckIcon className="text-green-500 h-auto inline-block w-4 absolute left-0.5"/>
                                                }
                                                {p.label}
                                            </DropdownMenu.Item>
                                        )
                                    } else if ("separator" in p && p.separator) {
                                        return (
                                            <DropdownMenu.Separator
                                                key={index}
                                                className="h-[1px] bg-zinc-400/20 dark:bg-zinc-800 m-[5px]"
                                            />
                                        )
                                    }
                                })}

                                <DropdownMenu.Separator
                                    className="h-[1px] bg-zinc-400/20 dark:bg-zinc-800 m-[5px]"
                                />

                                <DropdownMenu.Item
                                    className="group text-[13px] leading-none rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-500"
                                    onSelect={() => setCompareWithPervious(!compareWithPervious)}
                                >
                                    {compareWithPervious &&
                                        <CheckIcon className="text-green-500 h-auto inline-block w-4 absolute left-0.5"/>
                                    }
                                    Compare with previous
                                </DropdownMenu.Item>

                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
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

        {dashboardsHasLoad && <SectionContainer size={"extra-big"}>
            <div className="-mx-2.5 pb-64 grid gap-4 grid-cols-1 md:grid-cols-2 ">
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
                                "relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow",
                                (size === "base" ? "" : "md:col-span-2"),
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
                                <TriggerStats
                                    trigger={trigger}
                                    title={title}
                                    defaultPeriod={periodConfiguration.period}
                                    defaultDate={date}
                                    hideViewSwitcher
                                    compareWithPrevious={compareWithPervious}
                                />
                            }

                            {type === "parameter" &&
                                <TriggerParamsStats
                                    trigger={trigger}
                                    defaultParameter={parameter}
                                    title={title}
                                    defaultPeriod={periodConfiguration.period}
                                    defaultDate={date}
                                    compareWithPrevious={compareWithPervious}
                                    hideFilters
                                />
                            }
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
