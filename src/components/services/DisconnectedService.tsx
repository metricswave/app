import BlockContainer from "../sections/BlockContainer"
import ServiceIcon from "../icons/ServiceIcon"
import {NoLinkButton} from "../buttons/LinkButton"
import React, {useState} from "react"
import {FormService, Service} from "../../types/Service"
import {DialogComponent} from "../dialog/DialogComponent"
import ServiceFormConnection from "./ServiceFormConnection"

type Props = {
    service: Service
    loading: boolean
    connectService: (service: Service) => void
    onConneted: () => void
}

export default function DisconnectedService({service, loading, connectService, onConneted: connected}: Props) {
    const [open, setOpen] = useState(false)

    if (service.configuration.type === "oauth") {
        return (
                <BlockContainer
                        onClick={(e) => {
                            e.preventDefault()
                            if (loading) return
                            connectService(service)
                        }}
                >

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
                                <NoLinkButton text="Connect →" loading={loading}/>
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
                        onOpenChange={setOpen}
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
