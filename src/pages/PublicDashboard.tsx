import SectionContainer from "../components/sections/SectionContainer"
import PageTitle from "../components/sections/PageTitle"
import React, {useEffect, useState} from "react"
import {TriggerParamsStats} from "../components/triggers/TriggerParamsStats"
import {calculateDefaultDateForPeriod, DEFAULT_PERIOD, Period} from "../types/Period"
import {Dashboard} from "../storage/Dashboard"
import {fetchApi} from "../helpers/ApiFetcher"
import {useParams} from "react-router-dom"
import {usePublicDashboardTriggersState} from "../storage/PublicDashboardTriggers"
import Logo from "../components/logo/Logo"
import {TriggerStats} from "../components/triggers/TriggerStats"
import {PeriodChooser} from "../components/dashboard/PeriodChooser"

export function PublicDashboard() {
    const [notFound, setNotFound] = useState(false)
    const {dashboardUuid} = useParams<{ dashboardUuid: string }>()
    const [dashboard, setDashboard] = useState<Dashboard | undefined>(undefined)
    const {triggerByUuid} = usePublicDashboardTriggersState(dashboardUuid!)
    const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD)
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
    const setPeriodAndDate = (period: Period) => {
        setDate(calculateDefaultDateForPeriod(period))
        setPeriod(period)
    }
    const [compareWithPrevious, setCompareWithPrevious] = useState<boolean>(false)

    useEffect(() => {
        fetchApi<Dashboard>(`/dashboards/${dashboardUuid}`, {
            success: (data) => {
                setDashboard(data.data)
            },
            error: () => setNotFound(true),
            catcher: () => setNotFound(true),
        })
    }, [dashboardUuid])

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
                {notFound && <SectionContainer>
                    <div className="pt-14 md:pt-44 text-center flex flex-col items-center justify-center gap-10 animate-pulse">
                        <div className="text-lg pb-20">
                            Dashboard not found<br/>or not longer available.
                        </div>
                    </div>
                </SectionContainer>}

                {!notFound && <>
                    <SectionContainer size={"big"}>
                        <div className="flex flex-row space-y-4 justify-between items-center">
                            <PageTitle title={`Dashboard: ${dashboard?.name}`}/>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 justify-end pt-4">
                            <PeriodChooser
                                activePeriodValue={period}
                                setPeriodAndDate={setPeriodAndDate}
                                compareWithPrevious={compareWithPrevious}
                                setCompareWithPrevious={setCompareWithPrevious}
                            />
                        </div>
                    </SectionContainer>

                    {dashboard !== undefined && <SectionContainer size={"extra-big"}>
                        <div className="-mx-2.5 pb-64 grid gap-4 grid-cols-1 md:grid-cols-2 ">
                            {dashboard.items.map(({eventUuid, title, size, type, parameter}, key) => {
                                const trigger = triggerByUuid(eventUuid)

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

                                        {type === "stats" &&
                                            <TriggerStats publicDashboard={dashboardUuid}
                                                          trigger={trigger}
                                                          title={title}
                                                          defaultPeriod={period}
                                                          compareWithPrevious={compareWithPrevious}
                                                          hideViewSwitcher/>
                                        }
                                        {type === "parameter" &&
                                            <TriggerParamsStats
                                                publicDashboard={dashboardUuid}
                                                trigger={trigger}
                                                defaultParameter={parameter}
                                                title={title}
                                                defaultPeriod={period}
                                                compareWithPrevious={compareWithPrevious}
                                                defaultDate={date}
                                                hideFilters
                                            />}
                                    </div>
                                )
                            })}
                        </div>
                    </SectionContainer>}
                </>}
            </div>
        </div>
    </>
}
