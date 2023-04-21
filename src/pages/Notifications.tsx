import React from "react"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"
import {useNotificationsStage} from "../storage/Notifications"

export default function Notifications() {
    const {notifications} = useNotificationsStage()

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
                                            <p className="text-sm opacity-70">Today at 10:30</p>
                                        </div>
                                    </div>

                                    <div className="">
                                        <p>{notification.data.content}</p>
                                    </div>
                                </div>
                        )
                    })}

                </SectionContainer>
            </>
    )
}
