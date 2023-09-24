import NotificationIcon from "../components/icons/NotificationIcon"
import React from "react"

export default function NotificationsPageEmptyState() {
    return (
        <div className="-mt-10 h-screen flex flex-col items-center justify-center">
            <div className="text-center max-w-[370px]">
                <NotificationIcon className="inline-block mb-4 h-10 w-10 opacity-10"/>
                <p className="opacity-50">We have not received any event yet, check your tracking code.</p>
            </div>
            <div className="h-[200px]"></div>
        </div>
    )
}
