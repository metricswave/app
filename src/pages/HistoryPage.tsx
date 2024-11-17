import PageTitle from "../components/sections/PageTitle";
import { useNotificationsStage } from "../storage/Notifications";
import DateJs from "../helpers/DateJs";
import NotificationsPageEmptyState from "./NotificationsPageEmptyState";
import ReactMarkdown from "react-markdown";
import SectionContainer from "../components/sections/SectionContainer";
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon";
import UserFilter from "../components/history/UserFilter";
import { useEffect, useState } from "react";

export default function HistoryPage() {
    const [filter, setFilter] = useState<string>("");
    const { notifications, setIdFilter } = useNotificationsStage();

    const formatTitleDate = function (date: string): string {
        const dt = DateJs.from(date);
        return dt.toLocaleString({ month: "long", day: "numeric", weekday: "short" });
    };

    useEffect(() => {
        setIdFilter(filter);
    }, [filter]);

    const aDayBefore = function (before: string, current: string): boolean {
        const bdt = DateJs.from(before);
        const cdt = DateJs.from(current);

        return bdt.ordinal < cdt.ordinal;
    };

    return (
        <SectionContainer>
            <div className="flex flex-col space-y-4 max-w-content">
                <PageTitle>
                    <h1 className="flex flex-row gap-4 items-center text-lg font-bold">
                        Relatime Events
                        <CircleArrowsIcon className="text-green-500 w-4 h-4 animate-pulse-spin" />
                    </h1>
                </PageTitle>

                <div className="py-2">
                    <UserFilter filter={filter} setFilter={setFilter} />
                </div>

                {notifications.map((notification, key) => {
                    let showDate = false;
                    const previous = notifications[key - 1] ?? null;

                    if (previous === null) {
                        showDate = true;
                    } else {
                        showDate = aDayBefore(previous.created_at, notification.created_at);
                    }

                    return (
                        <>
                            {showDate && (
                                <h3 className="pt-4 opacity-75 uppercase text-sm">
                                    {formatTitleDate(notification.created_at)}
                                </h3>
                            )}

                            <div
                                key={notification.id}
                                className="flex flex-col space-y-2 rounded-sm p-3 border soft-border text-sm sm:text-base"
                            >
                                <div className="flex flex-row items-start justify-start">
                                    <div className="flex flex-row w-full items-center justify-between space-y-1">
                                        <h2 className="flex flex-row items-center gap-3 font-bold text-sm">
                                            <span className="text-lg">{notification.data.emoji}</span>
                                            <span>{notification.data.title}</span>
                                        </h2>

                                        <p
                                            title={DateJs.toRfc(notification.created_at)}
                                            className="text-xs opacity-70 cursor-help"
                                        >
                                            {DateJs.relative(notification.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="prose-sm prose dark:prose-invert prose-p:my-0.5">
                                    <ReactMarkdown>{notification.data.content.replaceAll("\n", "\n\n")}</ReactMarkdown>
                                </div>
                            </div>
                        </>
                    );
                })}
            </div>
        </SectionContainer>
    );
}
