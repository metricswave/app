import {TriggerType} from "../../types/TriggerType"
import React, {Dispatch, SetStateAction} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import SearchInputField from "../form/SearchInputField"
import {NoLinkButton} from "../buttons/LinkButton"

type TriggersAddChooseStepProps = {
    triggerTypes: TriggerType[],
    chooser: Dispatch<SetStateAction<TriggerType | null>>
}

export default function TriggersAddChooserStep({triggerTypes, chooser}: TriggersAddChooseStepProps) {
    const [search, setSearch] = React.useState<string>("")

    return (
            <>
                <div className="flex flex-row space-x-10 mt-5 mb-2">
                    <div>
                        <Dialog.Title className="font-bold m-0 text-xl">
                            Trigger Type
                        </Dialog.Title>

                        <Dialog.Description className="mt-2 mb-6 opacity-70">
                            Choose a trigger type to get started.
                        </Dialog.Description>
                    </div>

                    <Dialog.Close asChild className="hidden sm:block">
                        <button
                                className="inline-flex h-[35px] w-[35px] aspect-square appearance-none items-center justify-center rounded-full focus:outline-none bg-blue-50/50 hover:bg-blue-50 smooth"
                                aria-label="Close"
                        >
                            <span className="rotate-45">+</span>
                        </button>
                    </Dialog.Close>
                </div>

                <div className="mb-4">
                    <SearchInputField value={search} focus setValue={setSearch} name="Filter" placeholder="Filter..."/>
                </div>

                <div className="flex flex-col space-y-6">
                    {triggerTypes.filter(tt => tt.name.toLowerCase().includes(search.toLowerCase()) || search === "").map((triggerType) => (
                            <div key={triggerType.id}
                                 onClick={() => {
                                     chooser(triggerType)
                                 }}
                                 className="flex flex-row space-x-4 items-start p-4 border rounded-sm soft-border hover:bg-blue-100/75 hover:border-blue-100 active:bg-blue-100/75 active:border-blue-100 smooth">
                                <img src={`/images/trigger-types/${triggerType.icon}`}
                                     alt={triggerType.name}
                                     className="w-12 h-12 rounded-sm"/>

                                <div className="flex flex-col space-y-1">
                                    <h3 className="font-bold">{triggerType.name}</h3>
                                    <p className="text-sm sm:text-base">{triggerType.description}</p>
                                    <p className="pt-2"><NoLinkButton text="Choose →"/></p>
                                </div>
                            </div>
                    ))}
                </div>
            </>
    )
}
