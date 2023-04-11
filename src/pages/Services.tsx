import SectionContainer from "../components/sections/SectionContainer"
import React, {useState} from "react"
import ServiceIcon from "../components/icons/ServiceIcon"
import CheckIcon from "../components/icons/CheckIcon"
import PageTitle from "../components/sections/PageTitle"
import {LinkButton} from "../components/buttons/LinkButton"
import {useServicesState} from "../storage/Services"
import {useUserServicesState} from "../storage/UserServices"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {useSearchParams} from "react-router-dom"

export default function Services() {
    const {services} = useServicesState()
    const {userServices, loadUserServices} = useUserServicesState()
    const [loading, setLoading] = useState<false | string>(false)
    const [searchParams] = useSearchParams()

    React.useEffect(() => {
        if (searchParams.get("connected") === "true") {
            loadUserServices(true)
        }
    }, [searchParams])

    const connectedServicesIds = userServices.map((service) => service.service_id)
    const connectedServices = services.filter((service) => connectedServicesIds.includes(service.id))
        .sort((a, b) => a.name.localeCompare(b.name))
    const disconnectedServices = services.filter((service) => !connectedServicesIds.includes(service.id))
        .sort((a, b) => a.name.localeCompare(b.name))

    const connectService = (driver: string) => {
        setLoading(driver)
        fetchAuthApi<{ path: string }>(`/auth/${driver}/redirect`, {
            success: (data) => {
                window.location.href = data.data.path
            },
            error: (error) => setLoading(false),
            catcher: () => setLoading(false),
        })
    }

    return (
        <>
            {/* Connected services */}
            {connectedServices.length > 0 && <SectionContainer>
                <PageTitle title="Services" description="Currently connected services."/>

                {connectedServices.map((service) => {
                    return (
                        <div key={service.id}
                             className="flex flex-col space-y-4 rounded-sm p-4 border soft-border text-sm sm:text-base">
                            <div className="flex flex-row items-center justify-start space-x-4">
                                <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                                    <ServiceIcon driver={service.driver} className="dark:text-white"/>
                                </div>

                                <div className="flex flex-col items-start justify-between space-y-1">
                                    <h2 className="font-bold">{service.name}</h2>
                                    <div className="text-sm opacity-70 text-green-600 dark:text-green-500 flex flex-row space-x-2 font-bold">
                                        <span>Connected</span>
                                        <CheckIcon className="w-4 h-4"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </SectionContainer>}

            {/* Available services */}
            {disconnectedServices.length > 0 && <SectionContainer>
                <PageTitle title="Available"
                           description="Connect with more services to be able to use more triggers."/>

                {disconnectedServices.map((service) => {
                    return (
                        <div key={service.id}
                             className="flex flex-col space-y-4 rounded-sm p-4 border soft-border text-sm sm:text-base">
                            <div className="flex flex-row items-start justify-start space-x-4">
                                <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                                    <ServiceIcon driver={service.driver} className="dark:text-white"/>
                                </div>

                                <div className="flex flex-col items-start justify-between space-y-1">
                                    <h2 className="font-bold">{service.name}</h2>
                                    <div className="text-sm opacity-70">
                                        <span>{service.description}</span>
                                    </div>
                                    <div className="pt-2 font-bold">
                                        <LinkButton href="#"
                                                    text="Connect →"
                                                    loading={service.driver === loading}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        if (loading === service.driver) return
                                                        connectService(service.driver)
                                                    }}/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                })}

            </SectionContainer>}
        </>
    )
}
