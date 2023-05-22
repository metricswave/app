import SectionContainer from "../components/sections/SectionContainer"
import React, {useState} from "react"
import PageTitle from "../components/sections/PageTitle"
import {useServicesState} from "../storage/Services"
import {useUserServicesState} from "../storage/UserServices"
import {useSearchParams} from "react-router-dom"
import {Service} from "../types/Service"
import DisconnectedService from "../components/services/DisconnectedService"
import UserServiceBlock from "../components/user_services/UserServiceBlock"
import {connectServiceMethod} from "../components/services/ConnectServiceMethod"

export default function Services() {
    const {services} = useServicesState()
    const {userServices, reloadUserServices} = useUserServicesState()
    const [loading, setLoading] = useState<false | string>(false)
    const [searchParams] = useSearchParams()

    React.useEffect(() => {
        if (searchParams.get("connected") === "true") {
            reloadUserServices()
        }
    }, [searchParams])

    const connectedServicesIds = userServices.map((service) => service.service_id)
    const disconnectedServices = services
            .filter((service) => !connectedServicesIds.includes(service.id) || service.multiple)
            .sort((a, b) => a.name.localeCompare(b.name))

    const connectService = async (service: Service) => {
        setLoading(service.driver)
        await connectServiceMethod(service, true)
        setLoading(false)
    }

    return (
            <>
                {/* Connected services */}
                {userServices.length > 0 && <SectionContainer>
                    <PageTitle title="Services" description="Currently connected services."/>

                    {userServices.map((userService) => {
                        const service = services.find((service) => service.id === userService.service_id)!

                        if (service === undefined) {
                            return (<div key={userService.id}></div>)
                        }

                        return (<UserServiceBlock
                                key={userService.id}
                                userService={userService}
                                service={service}
                                onDeleted={reloadUserServices}
                        />)
                    })}
                </SectionContainer>}

                {/* Available services */}
                {disconnectedServices.length > 0 && <SectionContainer>
                    <PageTitle
                            title="Available"
                            description="Connect with more services to be able to use more triggers."
                    />

                    {disconnectedServices.map((service) =>
                            <DisconnectedService
                                    key={service.id}
                                    service={service}
                                    loading={loading === service.driver}
                                    connectService={connectService}
                                    onConnected={reloadUserServices}
                            />,
                    )}
                </SectionContainer>}
            </>
    )
}
