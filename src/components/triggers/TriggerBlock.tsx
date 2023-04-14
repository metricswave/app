import React from "react"
import {useNavigate} from "react-router-dom"
import {useTriggerTypesState} from "../../storage/TriggerTypes"
import {Trigger} from "../../types/Trigger"
import BlockContainer from "../sections/BlockContainer"

export default function TriggerBlock({trigger}: { trigger: Trigger }) {
    const {getTriggerType} = useTriggerTypesState()
    const triggerType = getTriggerType(trigger.trigger_type_id)
    const navigate = useNavigate()

    return (
            <BlockContainer
                    key={trigger.id}
                    onClick={() => navigate(`/triggers/${trigger.uuid}`)}
                    className="border soft-border rounded-sm p-4 flex flex-col space-y-4 cursor-pointer"
            >

                <div className="flex flex-row space-x-4 items-start">

                    <div>
                        <div className="text-2xl w-14 h-14 inline-flex items-center justify-center bg-[var(--background-50-color)] border border-[var(--background-100-color)] rounded-sm">
                            {trigger.emoji}
                        </div>
                    </div>

                    <div className="w-full">
                        <h3 className="font-bold mb-2">
                            {trigger.title}
                        </h3>

                        <p className="text-sm">{trigger.content}</p>

                        {triggerType !== undefined &&
                                <div className="flex flex-row items-center space-x-2 mt-4 w-full text-sm">
                                    <img src={`/images/trigger-types/${triggerType.icon}`}
                                         alt={triggerType.name}
                                         className="w-4 h-4 rounded-sm"/>
                                    <div className="">{triggerType.name}</div>
                                </div>
                        }
                    </div>

                </div>

            </BlockContainer>
    )
}
