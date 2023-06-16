import SectionContainer from "../components/sections/SectionContainer"
import PageTitle from "../components/sections/PageTitle"
import React, {useEffect, useState} from "react"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"
import InputFieldBox from "../components/form/InputFieldBox"
import DropDownSelectFieldBox from "../components/form/DropDownSelectFieldBox"
import {calculateDate, Period} from "../types/Period"
import {Dashboard} from "../storage/Dasboard"
import {fetchApi} from "../helpers/ApiFetcher"
import {useParams} from "react-router-dom"
import {usePublicDashboardTriggersState} from "../storage/PublicDashboardTriggers"
import Logo from "../components/logo/Logo"

export function PublicDashboard() {
    const {dashboardUuid} = useParams<{ dashboardUuid: string }>()
    const [dashboard, setDashboard] = useState<Dashboard | undefined>(undefined)
    const {triggerByUuid} = usePublicDashboardTriggersState(dashboardUuid!)
    const [period, setPeriod] = useState<Period>("daily")
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
    const setPeriodAndDate = (period: Period) => {
        setDate(calculateDate(period, undefined))
        setPeriod(period)
    }
    const dateFieldType = period === "monthly" ? "month" : "date"

    useEffect(() => {
        fetchApi<Dashboard>(`/dashboards/${dashboardUuid}`, {
            success: (data) => {
                setDashboard(data.data)
            },
            error: () => null,
            catcher: () => null,
        })
    }, [])

    return <>
        <div className="">
            <header id="top-nav-menu"
                    className="flex flex-row space-x-4 items-center justify-between py-5 px-5 border-b soft-border text-sm fixed top-0 left-0 right-0 bg-[var(--background-color)] z-30 drop-shadow-sm dark:drop-shadow-xl">
                <Logo/>
                <div className="hidden sm:block">
                </div>
                <div>
                    <ul className="flex flex-row space-x-4 items-center">
                        <li>
                            <a
                                href="/auth/signup?utm_source=public_dashboard"
                                className="py-3 px-4 rounded bg-blue-500 text-white smooth hover:bg-blue-600"
                            >
                                Create your account
                            </a>
                        </li>
                    </ul>
                </div>
            </header>

            <div id="app-container" className="pt-[65px] pb-[81px] sm:pb-0">
                <SectionContainer size={"big"}>
                    <div className="flex flex-row space-y-4 justify-between items-center">
                        <PageTitle title={`Dashboard: ${dashboard?.name}`}/>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 justify-end pt-4">
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
                </SectionContainer>

                {dashboard !== undefined && <SectionContainer size={"extra-big"}>
                    <div className="-mx-2.5 pb-64">
                        {dashboard.items.map(({eventUuid, title, size, type, parameter}, key) => {
                            const trigger = triggerByUuid(eventUuid)
                            console.log(trigger)

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

                                    {type === "stats" &&
                                        <TriggerStats publicDashboard={dashboardUuid}
                                                      trigger={trigger}
                                                      title={title}
                                                      defaultView={period}
                                                      hideViewSwitcher/>}
                                    {type === "parameter" &&
                                        <TriggerParamsStats
                                            publicDashboard={dashboardUuid}
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
                    </div>
                </SectionContainer>}
            </div>
        </div>
    </>
}
