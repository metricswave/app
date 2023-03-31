import SectionContainer from "../components/sections/SectionContainer"
import React from "react"
import GoogleIcon from "../components/icons/GoogleIcon"
import CheckIcon from "../components/icons/CheckIcon"
import PageTitle from "../components/sections/PageTitle"
import LinkButton from "../components/buttons/LinkButton"

export default function Services() {
    return (
            <>
                <PageTitle title="Services" description="Currently connected services."/>

                <SectionContainer>

                    {[0].map((item) => {
                        return (
                                <div key={item}
                                     className="flex flex-col space-y-4 rounded-sm p-4 border soft-border text-sm sm:text-base">
                                    <div className="flex flex-row items-center justify-start space-x-4">
                                        <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                                            <GoogleIcon className="dark:text-white"/>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center sm:justify-between space-y-1 sm:space-y-0 sm:space-x-4 h-12">
                                            <h2 className="font-bold">Google</h2>
                                            <div className="text-sm opacity-70 text-green-600 dark:text-green-500 flex flex-row space-x-2">
                                                <CheckIcon className="w-4 h-4"/>
                                                <span>Connected</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        )
                    })}

                </SectionContainer>

                <PageTitle title="Available" description="Connect with more services to be able to use more triggers."/>

                <SectionContainer>

                    {[0].map((item) => {
                        return (
                                <div key={item}
                                     className="flex flex-col space-y-4 rounded-sm p-4 border soft-border text-sm sm:text-base">
                                    <div className="flex flex-row items-start justify-start space-x-4">
                                        <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                                            <GoogleIcon className="dark:text-white"/>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center sm:justify-between space-y-1 sm:space-y-0 sm:space-x-4">
                                            <h2 className="font-bold">Google</h2>
                                            <div className="text-sm opacity-70">
                                                <span>TTL, incoming meeting, topic search, and more.</span>
                                            </div>
                                            <div className="pt-4">
                                                <LinkButton href="#" text="Connect →"/>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                        )
                    })}

                </SectionContainer>
            </>
    )
}
