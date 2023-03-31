import React from "react"
import {AuthContext} from "../contexts/AuthContext"
import PageTitle from "../components/sections/PageTitle"
import SectionContainer from "../components/sections/SectionContainer"

export default function Notifications() {
    const {user} = React.useContext(AuthContext)
    return (
            <>
                <PageTitle title="Notifications"/>

                <SectionContainer>

                    {[0, 1, 2, 3, 4].map((item) => {
                        return (
                                <div key={item}
                                     className="flex flex-col space-y-4 rounded-sm p-4 border soft-border text-sm sm:text-base">
                                    <div className="flex flex-row items-center justify-start space-x-4">
                                        <div className="text-3xl w-11 h-11 bg-pink-500/10 flex items-center justify-center rounded border border-pink-500/25">
                                            <span>🌊</span>
                                        </div>

                                        <div className="flex flex-col items-start space-y-1">
                                            <h2 className="font-bold">Time to leave: Pádel</h2>
                                            <p className="text-sm opacity-70">Today at 10:30</p>
                                        </div>
                                    </div>

                                    <div className="">
                                        <p>You should leave at 10:15 to get there on time if you go by car.</p>
                                    </div>
                                </div>
                        )
                    })}

                </SectionContainer>
            </>
    )
}
