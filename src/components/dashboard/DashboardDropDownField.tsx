import React, {useEffect, useState} from "react"
import InputLabel from "../form/InputLabel"
import * as Popover from "@radix-ui/react-popover"
import {Cross2Icon, MixerHorizontalIcon} from "@radix-ui/react-icons"
import {Dashboard, useDashboardsState} from "../../storage/Dasboard"
import PrimaryButton from "../form/PrimaryButton"
import Switch from "../switch/Switch"
import {CopyButtonIcon} from "../form/CopyButton"


type Props = {
    value: string | string[],
    options: { label: string, value: string }[],
    setValue: (value: string | string[]) => void,
    label: string,
    name: string,
    multiple?: boolean,
    required?: boolean,
    showRequired?: boolean,
    className?: string,
    activeDashboard: Dashboard,
    updateDashboard: (dashboard: Dashboard, title: string, isPublic: boolean) => void,
}


export default function DashboardDropDownField(
    {
        value,
        name,
        options,
        setValue,
        label,
        activeDashboard,
        updateDashboard,
        required = false,
        showRequired = false,
        className = "",
    }: Props,
) {
    return (
        <>
            <div className={[
                "flex flex-row items-center border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600",
                className,
            ].join(" ")}>

                <div className="py-2 flex-grow">
                    <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                    <div className="flex flex-col space-y-2">
                        <select
                            className="bg-transparent py-3 mx-3"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            name={name}
                        >
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-6 px-4">
                    {activeDashboard !== undefined &&
                        <DashboardPopOver dashboard={activeDashboard} onUpdate={(title, isPublic) => {
                            updateDashboard(activeDashboard, title, isPublic)
                        }}/>}
                </div>

            </div>
        </>
    )
}

const DashboardPopOver = ({dashboard, onUpdate: update}: {
    dashboard: Dashboard,
    onUpdate: (title: string, isPublic: boolean) => void
}) => {
    const {publicDashboardPath} = useDashboardsState()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(dashboard.name)
    const [isPublic, setIsPublic] = useState(dashboard.public)

    const handleUpdate = () => {
        setOpen(false)
        update(name, isPublic)
    }

    useEffect(() => {
        setName(dashboard.name)
        setIsPublic(dashboard.public)
    }, [open])

    return <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
            <button
                className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default outline-none"
                aria-label="Update dimensions"
            >
                <MixerHorizontalIcon/>
            </button>
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content
                className="rounded p-5 w-[260px] bg-white dark:bg-zinc-800 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
                sideOffset={5}
            >
                <div className="flex flex-col gap-2.5">
                    <p className="text-mauve12 text-sm leading-[19px] font-bold mb-2.5">Configuration</p>
                    <fieldset className="flex gap-5 items-center">
                        <label className="text-sm text-violet11 w-[75px]" htmlFor="width">
                            Name
                        </label>
                        <input
                            className="w-full inline-flex items-center justify-center flex-1 rounded-sm px-2.5 text-sm leading-none text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 shadow-[0_0_0_1px] shadow-zinc-200 dark:shadow-zinc-700 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-zinc-400 outline-none"
                            id="name"
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleUpdate()
                                }
                            }}
                            defaultValue={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </fieldset>
                    <fieldset className="flex gap-5 justify-between items-center">
                        <label className="text-sm text-violet11 w-[75px]" htmlFor="maxHeight">
                            Public
                        </label>
                        <Switch value={isPublic} onChange={setIsPublic}/>
                    </fieldset>

                    {dashboard.public && <div>
                        <div className="p-2 border soft-border">
                            <div className=" flex flex-row gap-2 items-center justify-between mb-2">
                                <p className="text-mauve12 text-sm leading-[19px] font-bold">Share</p>
                                <div className="cursor-pointer rounded-sm hover:bg-zinc-100 smooth p-1">
                                    <CopyButtonIcon textToCopy={publicDashboardPath(dashboard)}/>
                                </div>
                            </div>
                            <div className="max-w-full truncate text-xs select-all">{publicDashboardPath(dashboard)}</div>
                        </div>
                    </div>}

                    <PrimaryButton
                        size={"small"}
                        text={"Update"}
                        onClick={handleUpdate}
                    />
                </div>
                <Popover.Close
                    className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
                    aria-label="Close"
                >
                    <Cross2Icon/>
                </Popover.Close>
                <Popover.Arrow className="fill-white dark:fill-zinc-800"/>
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
}
