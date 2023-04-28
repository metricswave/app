import NotificationIcon from "../components/icons/NotificationIcon"
import React from "react"
import {LinkButton} from "../components/buttons/LinkButton"

export default function NotificationsPageEmptyState() {
    return (
            <div className="-mt-10 h-screen flex flex-col items-center justify-center">
                <div className="text-center max-w-[370px]">
                    <NotificationIcon className="inline-block mb-4 h-10 w-10 opacity-10"/>
                    <p className="opacity-50">To receive notifications<br/>you need to create some trigger.</p>
                    <div className="p-6">
                        <div className="border soft-border rounded-sm p-4 flex flex-col space-y-4 items-center hover:bg-[var(--background-50-color)] smooth cursor-pointer">
                            <LinkButton href="/triggers" text="Go to Triggers"/>
                        </div>
                    </div>
                </div>
                <div className="h-[200px]"></div>
            </div>
    )
}
