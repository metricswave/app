import PageTitle from "../components/sections/PageTitle";
import { useNotificationsStage } from "../storage/Notifications";
import DateJs from "../helpers/DateJs";
import ReactMarkdown from "react-markdown";
import SectionContainer from "../components/sections/SectionContainer";
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon";
import UserFilter from "../components/history/UserFilter";
import { useEffect, useState } from "react";
import PauseIcon from "../components/icons/PauseIcon";
import RelativeDate from "../components/date/relative";
import PrimaryButton from "../components/form/PrimaryButton";
import { Button } from "../components/ui/button";

export default function HistoryPage() {
    const [filter, setFilter] = useState<string>("");
    const { notifications, load, fetched, fetching, thereIsMore, filter: idFilter, loadPage } = useNotificationsStage();

    const formatTitleDate = function (date: string): string {
        const dt = DateJs.from(date);
        return dt.toLocaleString({ month: "long", day: "numeric", weekday: "short" });
    };

    const aDayBefore = (before: string, current: string): boolean =>
        DateJs.from(before).ordinal > DateJs.from(current).ordinal;

    return (
        <SectionContainer>
            <div
                className={[
                    "flex flex-col min-h-screen space-y-4 max-w-content smooth-all",
                    !fetched ? "justify-center" : "",
                ].join(" ")}
            >
                <div className="py-2 mb-12">
                    <UserFilter filter={filter} setFilter={setFilter} />
                    {(idFilter === "" || filter !== idFilter) && (
                        <PrimaryButton
                            text="Search"
                            className="w-full mt-3"
                            onClick={() => {
                                load(filter);
                            }}
                        />
                    )}
                </div>

                {!fetched && <div className="h-[50vh]" key="decorator"></div>}

                {fetched && (
                    <>
                        <PageTitle>
                            <h1 className="flex flex-row gap-4 justify-between items-center text-lg font-bold">
                                User events
                                <div
                                    className={[
                                        "flex flex-row items-center gap-2 group rounded-full py-1 pl-1.5 pr-2 select-none smooth-all",
                                        !fetching
                                            ? "cursor-pointer bg-zinc-500/5 hover:bg-zinc-500/15"
                                            : "bg-green-500/5 hover:bg-green-500/15 animate-pulse",
                                    ].join(" ")}
                                    onClick={() => (fetching === false ? loadPage(1) : null)}
                                >
                                    <CircleArrowsIcon
                                        className={[
                                            "group-hover:text-green-500 w-4 h-4 smooth-all",
                                            !fetching ? "text-zinc-500/75" : "text-green-500/75 animate-spin",
                                        ].join(" ")}
                                    />
                                    <span
                                        className={[
                                            "text-xs uppercase tracking-wide font-normal smooth-all",
                                            !fetching
                                                ? "text-zinc-500/75 group-hover:text-green-500"
                                                : "text-green-500/75 group-hover:text-green-500",
                                        ].join(" ")}
                                    >
                                        {fetching ? "Loading" : "Refresh"}
                                    </span>
                                </div>
                            </h1>
                        </PageTitle>

                        {notifications.length === 0 && (
                            <div className="flex flex-col space-y-2 rounded-sm px-3 border soft-border text-sm text-center py-9">
                                <span className="opacity-75 animate-pulse">Nothing found.</span>
                            </div>
                        )}

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
                                        <h3
                                            key={notification.id + "_date"}
                                            className="pt-4 opacity-75 uppercase text-sm"
                                        >
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
                                                    <RelativeDate date={notification.created_at} />
                                                </p>
                                            </div>
                                        </div>

                                        <div className="prose-sm prose dark:prose-invert prose-p:my-0.5">
                                            <ReactMarkdown>
                                                {notification.data.content.replaceAll("\n", "\n\n")}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </>
                            );
                        })}

                        {thereIsMore && (
                            <Button size="lg" variant="outline" onClick={() => loadPage()}>
                                Load more
                            </Button>
                        )}
                    </>
                )}
            </div>
        </SectionContainer>
    );
}
