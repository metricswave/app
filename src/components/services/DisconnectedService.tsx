import BlockContainer from "../sections/BlockContainer"
import ServiceIcon from "../icons/ServiceIcon"
import {NoLinkButton} from "../buttons/LinkButton"
import React, {useState} from "react"
import {FormService, Service} from "../../types/Service"
import {DialogComponent} from "../dialog/DialogComponent"
import ServiceFormConnection from "./ServiceFormConnection"
import {track} from "@amplitude/analytics-browser"
import Tooltip from "../tooltip/Tooltip"
import {app} from "../../config/app"

type Props = {
    service: Service
    loading: boolean
    connectService: (service: Service) => void
    onConnected: () => void
}

export default function DisconnectedService({service, loading, connectService, onConnected: connected}: Props) {
    const [open, setOpen] = useState(false)

    if (service.configuration.type === "oauth") {
        return (
                <BlockContainer
                        onClick={(e) => {
                            e.preventDefault()
                            track("Connect Service")
                            if (loading) return
                            connectService(service)
                        }}
                >

                    <div className="w-full flex flex-row items-start justify-start space-x-4">

                        <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                            <ServiceIcon driver={service.driver} className="dark:text-white"/>
                        </div>

                        <div className="w-full flex flex-col items-start justify-between space-y-1">
                            <h2 className="font-bold">{service.name}</h2>

                            <div className="text-sm opacity-70">
                                <span>{service.description}</span>
                            </div>

                            <div className="w-full flex flex-row justify-between items-center pt-2 font-bold">
                                <NoLinkButton text="Connect →" loading={loading}/>
                                {service.driver === "google" &&
                                        <div>
                                            <Tooltip>
                                                By granting access, our app will be able to read
                                                your calendar events. We will only use this information to provide you
                                                with the requested service and will not share it with any third parties.
                                                By authorizing access, you agree to
                                                our <a onClick={e => e.stopPropagation()}
                                                       target="_blank"
                                                       className="underline" href={`${app.web}/terms-and-conditions`}>terms
                                                of service</a> and <a onClick={e => e.stopPropagation()}
                                                                      target="_blank"
                                                                      className="underline"
                                                                      href={`${app.web}/privacy-policy`}>privacy
                                                policy</a>.
                                            </Tooltip>
                                        </div>
                                }
                            </div>
                        </div>

                    </div>

                </BlockContainer>
        )
    }

    if (service.configuration.type === "form") {
        return (
                <DialogComponent
                        open={open}
                        onOpenChange={state => {
                            if (state) track("Connect Service")
                            setOpen(state)
                        }}
                        button={
                            <BlockContainer>
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
                                            <NoLinkButton text="Create new →" loading={loading}/>
                                        </div>
                                    </div>

                                </div>
                            </BlockContainer>
                        }>
                    <ServiceFormConnection service={service as FormService} onCreated={() => {
                        setOpen(false)
                        connected()
                    }}/>
                </DialogComponent>
        )
    }

    return <></>
}
