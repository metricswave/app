import React, { useEffect, useState } from "react";
import { calculateDefaultDateForPeriod, DEFAULT_PERIOD, Period, PeriodRange, periods } from "../types/Period";
import { publicDashboardPath, useDashboardsState } from "../storage/Dashboard";
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon";
import { useSearchParams } from "react-router-dom";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import { Dashboard, DashboardItem } from "../types/Dashboard";
import { useAuthContext } from "../contexts/AuthContext";
import { NewDashboardDialog } from "../components/dashboard/NewDashboardDialog";
import PageTitle from "../components/sections/PageTitle";
import SectionContainer from "../components/sections/SectionContainer";
import { PeriodChooser } from "../components/dashboard/PeriodChooser";
import { CopyButtonIcon } from "../components/form/CopyButton";
import DashboardDropDownField from "../components/dashboard/DashboardDropDownField";
import { DashboardView } from "../components/dashboard/DashboardView";
import { TeamSetUp } from "../components/team/TeamSetUp";

export function Dashboards() {
    const { dashboards, addWidgetToDashboard, updateDashboard, reloadDashboards } = useDashboardsState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [period, setPeriod] = useState<Period>((searchParams.get("period") as Period) ?? DEFAULT_PERIOD);
    const periodConfiguration = periods.find((p) => p.value === period)!;
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [fromDate, setFromDate] = useState<string | undefined>();
    const [dashboardIndex, setDashboardIndex] = useState<number>(
        searchParams.get("dashboard") !== null ? parseInt(searchParams.get("dashboard")!) : 0,
    );
    const [compareWithPrevious, setCompareWithPrevious] = useState<boolean>(searchParams.get("compare") === "1");
    const [dashboardJustCreated, setDashboardJustCreated] = useState<boolean>(false);
    const setPeriodAndDate = (period: Period, range?: PeriodRange) => {
        setPeriod(period);

        if (range !== undefined && range.to !== undefined && range.from !== undefined) {
            setDate(range.to.toISOString().split("T")[0]);
            setFromDate(range.from.toISOString().split("T")[0]);
        } else {
            setDate(calculateDefaultDateForPeriod(period));
            setFromDate(undefined);
        }
    };
    const [newDashboardDialogOpen, setNewDashboardDialogOpen] = useState<boolean>(false);
    const [changedToPublic, setChangedToPublic] = useState<boolean>(false);

    const context = useAuthContext();
    const currentTeam = context.userState.currentTeam(context.teamState.currentTeamId);

    const dashboardsHasLoad =
        dashboards !== undefined && dashboards.length > 0 && dashboards[dashboardIndex] !== undefined;

    useEffect(() => {
        if (
            dashboards !== undefined &&
            dashboards[0].id !== undefined &&
            dashboards.length > 0 &&
            dashboards[dashboardIndex] === undefined &&
            dashboardIndex !== 0
        ) {
            setDashboardIndex(0);
        }
    }, [dashboards, dashboardIndex]);

    let addButtonSize = "md:col-span-2";
    if (dashboardsHasLoad && dashboards[dashboardIndex].items) {
        addButtonSize =
            dashboards[dashboardIndex].items.reduce((acc, item) => {
                return acc + (item.size === "base" ? 1 : 2);
            }, 0) %
                2 ===
            0
                ? "md:col-span-2"
                : "md:col-span-1";
    }

    useEffect(
        () =>
            setSearchParams({ compare: compareWithPrevious ? "1" : "0", period, dashboard: dashboardIndex.toString() }),
        [period, dashboardIndex, compareWithPrevious],
    );

    const handleDashboardUpdate = (dashboardIndex: number, fields: Partial<Dashboard>) => {
        if (fields.public !== undefined && fields.public && !dashboards[dashboardIndex].public) {
            setChangedToPublic(true);
        }

        updateDashboard(dashboardIndex, fields);
    };

    const handleDashboardDeleted = (dashboardIndex: number) => {
        fetchAuthApi(`/dashboards/${dashboards[dashboardIndex].id}`, {
            method: "DELETE",
            success: () => {
                setDashboardIndex(0);
                reloadDashboards(true);
            },
            error: () => null,
            catcher: () => null,
        });
    };

    const handleDashboardCreated = () => {
        setNewDashboardDialogOpen(false);
        setDashboardJustCreated(true);
        reloadDashboards(true);
    };

    useEffect(() => {
        if (dashboardJustCreated) {
            setDashboardIndex(dashboards.length - 1);
            setDashboardJustCreated(false);
        }
    }, [dashboards]);

    if (!dashboardsHasLoad || currentTeam === undefined) {
        return (
            <>
                <div className="flex flex-col gap-4 items-center animate-pulse justify-center pt-20 sm:pt-44 md:pt-64">
                    <CircleArrowsIcon className="animate-spin h-6" />
                    <div>Loading…</div>
                </div>
            </>
        );
    }

    if (currentTeam?.initiated === false) {
        return (
            <>
                <TeamSetUp />
            </>
        );
    }

    return (
        <>
            <NewDashboardDialog
                created={handleDashboardCreated}
                open={newDashboardDialogOpen}
                setOpen={setNewDashboardDialogOpen}
            />

            <SectionContainer size={"big"}>
                <div className="flex flex-row space-y-4 justify-between items-center">
                    <PageTitle title={"Dashboards"} />
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 justify-end pt-4">
                    <div className="w-full">
                        <DashboardDropDownField
                            initCreateNewDashboard={() => setNewDashboardDialogOpen(true)}
                            updateDashboard={(dashboard, title, isPublic) => {
                                handleDashboardUpdate(dashboardIndex, { name: title, public: isPublic });
                            }}
                            deleteDashboard={(dashboard) => {
                                handleDashboardDeleted(dashboardIndex);
                            }}
                            activeDashboard={dashboards[dashboardIndex]}
                            value={dashboardIndex.toString()}
                            options={dashboards.map((dashboard, index) => ({
                                value: index.toString(),
                                label: dashboard.name,
                            }))}
                            setValue={(value) => {
                                setDashboardIndex(parseInt(value as string));
                            }}
                        />
                    </div>

                    <PeriodChooser
                        activePeriodValue={period}
                        setPeriodAndDate={setPeriodAndDate}
                        compareWithPrevious={compareWithPrevious}
                        setCompareWithPrevious={setCompareWithPrevious}
                    />
                </div>

                {dashboards[dashboardIndex].uuid !== null && changedToPublic && (
                    <div>
                        <div className="p-4 bg-green-100 border border-green-200 dark:bg-green-800/20 dark:border-green-800/50">
                            <div className=" flex flex-row gap-2 items-center justify-between">
                                <p className="text-mauve12 text-sm leading-[19px] font-bold">Share your dashboard!</p>
                                <div className="flex flex-row gap-2 items-center">
                                    <div className="max-w-full truncate text-xs select-all">
                                        {publicDashboardPath(dashboards[dashboardIndex])}
                                    </div>
                                    <div className="cursor-pointer rounded-sm hover:bg-zinc-100 smooth p-1">
                                        <CopyButtonIcon textToCopy={publicDashboardPath(dashboards[dashboardIndex])} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SectionContainer>

            {dashboardsHasLoad && (
                <DashboardView
                    dashboards={dashboards}
                    dashboardIndex={dashboardIndex}
                    addButtonSize={addButtonSize}
                    period={periodConfiguration}
                    compareWithPrevious={compareWithPrevious}
                    date={date}
                    fromDate={fromDate}
                    addWidgetToDashboard={(item: DashboardItem) => {
                        addWidgetToDashboard(dashboardIndex, item);
                    }}
                />
            )}
        </>
    );
}
