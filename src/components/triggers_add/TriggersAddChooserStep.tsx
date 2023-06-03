import {TriggerType} from "../../types/TriggerType"
import React, {Dispatch, SetStateAction} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import SearchInputField from "../form/SearchInputField"
import {NoLinkButton} from "../buttons/LinkButton"
import {DialogHeader} from "../dialog/DialogHeader"
import BlockContainer from "../sections/BlockContainer"
import {useUserServicesState} from "../../storage/UserServices"
import {TriggerTypeId} from "../../types/Trigger"
import {UserService, UserServiceType} from "../../types/UserService"
import {connectServiceMethod} from "../services/ConnectServiceMethod"
import {useServicesState} from "../../storage/Services"
import {Service} from "../../types/Service"

type TriggersAddChooseStepProps = {
    triggerTypes: TriggerType[],
    chooser: Dispatch<SetStateAction<TriggerType | null>>
}


export default function TriggersAddChooserStep({triggerTypes, chooser}: TriggersAddChooseStepProps) {
    const [loading, setLoading] = React.useState<false | string>(false)
    const [search, setSearch] = React.useState<string>("")
    const {userServices} = useUserServicesState()
    const {services} = useServicesState()

    const requiredService = (triggerType: TriggerType): Service | null => {
        if (triggerType.id === TriggerTypeId.CalendarTimeToLeave) {
            return services.find(s => s.id === UserServiceType.Google) as Service
        }

        return null
    }

    const meetMinimumRequirements = (triggerType: TriggerType, userServices: UserService[]): true | string => {
        const required = requiredService(triggerType)

        if (required === null) {
            return true
        }

        return userServices.find(us => us.service_id === required.id) ?
            true :
            `You need to connect your ${required.name} before using this trigger.`
    }

    const filtered = triggerTypes.filter(tt => tt.name.toLowerCase().includes(search.toLowerCase()) || search === "")

    return (
        <>
            <DialogHeader/>

            <div className="flex flex-row space-x-10 mt-5 sm:mt-0 mb-2 justify-between items-start">
                <div>
                    <Dialog.Title className="font-bold m-0 text-xl">
                        Trigger Type
                    </Dialog.Title>

                    <Dialog.Description className="mt-2 mb-6 opacity-70">
                        Choose a trigger type to get started.
                    </Dialog.Description>
                </div>
            </div>

            <div className="mb-4">
                <SearchInputField
                    autoComplete="off"
                    value={search}
                    focus
                    setValue={setSearch}
                    name="Filter"
                    placeholder="Filter..."/>
            </div>

            <div className="flex flex-col space-y-6">
                {filtered.map((triggerType: TriggerType) => {
                    const meetsRequirements = meetMinimumRequirements(triggerType, userServices)

                    if (meetsRequirements !== true) {
                        return (
                            <BlockContainer
                                row={false}
                                key={triggerType.id}
                                onClick={() => {
                                    setLoading(triggerType.name)
                                    connectServiceMethod(requiredService(triggerType) as Service, true)
                                }}
                            >
                                <div className="flex flex-row space-x-4">
                                    <img src={`/images/trigger-types/${triggerType.icon}`}
                                         alt={triggerType.name}
                                         className="w-12 h-12 rounded-sm"/>

                                    <div className="flex flex-col space-y-1">
                                        <h3 className="font-bold">{triggerType.name}</h3>
                                        <p className="text-sm sm:text-base">{triggerType.description}</p>
                                        <p className="text-sm font-bold opacity-70 pt-2">{meetsRequirements}</p>
                                        <p className="pt-2">
                                            <NoLinkButton loading={loading === triggerType.name}
                                                          text="Connect Google Calendar →"/>
                                        </p>
                                    </div>
                                </div>

                            </BlockContainer>
                        )
                    }

                    return (
                        <BlockContainer
                            key={triggerType.id}
                            onClick={() => {
                                chooser(triggerType)
                            }}
                        >

                            <img src={`/images/trigger-types/${triggerType.icon}`}
                                 alt={triggerType.name}
                                 className="w-12 h-12 rounded-sm"/>

                            <div className="flex flex-col space-y-1">
                                <h3 className="font-bold">{triggerType.name}</h3>
                                <p className="text-sm sm:text-base">{triggerType.description}</p>
                                <p className="pt-2"><NoLinkButton text="Choose →"/></p>
                            </div>

                        </BlockContainer>
                    )
                })}
            </div>
        </>
    )
}
