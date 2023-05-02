import React from "react"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"
import {useNotificationsStage} from "../storage/Notifications"
import DateJs from "../helpers/DateJs"
import NotificationsPageEmptyState from "./NotificationsPageEmptyState"
import ReactMarkdown from "react-markdown"

export default function Notifications() {
    const {notifications} = useNotificationsStage()

    if (notifications.length === 0) return (
            <NotificationsPageEmptyState/>
    )

    return (
            <>

                <SectionContainer>
                    <PageTitle title="Notifications"/>

                    {notifications.map((notification) => {
                        return (
                                <div key={notification.id}
                                     className="flex flex-col space-y-4 rounded-sm p-4 border soft-border text-sm sm:text-base">
                                    <div className="flex flex-row items-center justify-start space-x-4">
                                        <div className="text-3xl w-11 h-11 bg-pink-500/10 flex items-center justify-center rounded border border-pink-500/25">
                                            <span>{notification.data.emoji}</span>
                                        </div>

                                        <div className="flex flex-col items-start space-y-1">
                                            <h2 className="font-bold">{notification.data.title}</h2>

                                            <p
                                                    title={DateJs.toRfc(notification.created_at)}
                                                    className="text-sm opacity-70 cursor-help"
                                            >
                                                {DateJs.relative(notification.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="prose dark:prose-invert prose-p:my-0.5">
                                        <ReactMarkdown>
                                            {notification.data.content.replaceAll("\n", "\n\n")}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                        )
                    })}

                </SectionContainer>
            </>
    )
}
