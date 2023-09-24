import BlockContainer from "../sections/BlockContainer"
import ServiceIcon from "../icons/ServiceIcon"
import {NoLinkButton} from "../buttons/LinkButton"
import React, {useState} from "react"
import {FormService} from "../../types/Service"
import {DialogComponent} from "../dialog/DialogComponent"
import ServiceFormConnection from "./ServiceFormConnection"
import {Channel} from "../../types/Channel";

type Props = {
    channel: Channel
    loading: boolean
    onConnected: () => void
}

export default function ChannelToConnect({channel, loading, onConnected: connected}: Props) {
    const [open, setOpen] = useState(false)

    return (
        <DialogComponent
            open={open}
            onOpenChange={state => {
                setOpen(state)
            }}
            button={
                <BlockContainer>
                    <div className="flex flex-row items-start justify-start space-x-4">

                        <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                            <ServiceIcon driver={channel.driver}
                                         className="dark:text-white"/>
                        </div>

                        <div className="flex flex-col items-start justify-between space-y-1">
                            <h2 className="font-bold">{channel.name}</h2>

                            <div className="text-sm opacity-70">
                                <span>{channel.description}</span>
                            </div>

                            <div className="pt-2 font-bold">
                                <NoLinkButton text="Create new →"
                                              loading={loading}/>
                            </div>
                        </div>

                    </div>
                </BlockContainer>
            }>
            <ServiceFormConnection channel={channel as FormService}
                                   onCreated={() => {
                                       setOpen(false)
                                       connected()
                                   }}/>
        </DialogComponent>
    )
}
