import React, {useEffect, useState} from "react"
import * as Popover from "@radix-ui/react-popover"
import {CheckIcon, ChevronDownIcon, Cross2Icon, MixerHorizontalIcon} from "@radix-ui/react-icons"
import {useDashboardsState} from "../../storage/Dashboard"
import PrimaryButton from "../form/PrimaryButton"
import Switch from "../switch/Switch"
import {CopyButtonIcon} from "../form/CopyButton"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import SecondaryButton from "../form/SecondaryButton"
import DeleteButton from "../form/DeleteButton"
import {Dashboard} from "../../types/Dashboard";

type Props = {
    value: string | string[],
    options: { label: string, value: string }[],
    setValue: (value: string | string[]) => void,
    className?: string,
    activeDashboard: Dashboard,
    updateDashboard: (dashboard: Dashboard, title: string, isPublic: boolean) => void,
    deleteDashboard: (dashboard: Dashboard) => void,
    initCreateNewDashboard: () => void,
}


export default function DashboardDropDownField(
    {
        value,
        options,
        setValue,
        activeDashboard,
        updateDashboard,
        deleteDashboard,
        className = "",
        initCreateNewDashboard,
    }: Props,
) {
    return (
        <>

            <div className={[
                "flex flex-row gap-4 p-2 items-center border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600",
                className,
            ].join(" ")}>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <div className="p-2 w-full flex-grow flex flex-row items-center justify-center rounded-sm cursor-pointer hover:bg-zinc-100/90 dark:hover:bg-zinc-700/10">
                            <div className="w-full">
                                {activeDashboard.name}
                            </div>

                            <ChevronDownIcon/>
                        </div>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="min-w-[220px] bg-white dark:bg-zinc-800 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                            sideOffset={5}
                            align={"start"}
                        >
                            {options.map((option, index) => (
                                <DropdownMenu.Item
                                    key={index}
                                    className="group text-[13px] leading-none rounded-[3px] flex items-center h-[35px] sm:h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-800/20 data-[highlighted]:text-blue-500 dark:data-[highlighted]:text-blue-100"
                                    onSelect={(e) => {
                                        setTimeout(() => setValue(option.value), 100)
                                    }}
                                >
                                    {option.value === value &&
                                        <CheckIcon className="text-green-500 h-auto inline-block w-4 absolute left-0.5"/>
                                    }
                                    {option.label}
                                </DropdownMenu.Item>
                            ))}

                            <DropdownMenu.Separator className="h-[1px] bg-zinc-400/20 dark:bg-zinc-700 m-[5px]"/>

                            <DropdownMenu.Item
                                className="group text-[13px] leading-none rounded-[3px] flex items-center h-[35px] sm:h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-800/20 data-[highlighted]:text-blue-500 dark:data-[highlighted]:text-blue-100"
                                onSelect={(e) => {
                                    setTimeout(initCreateNewDashboard, 100)
                                }}
                            >
                                New Dashboard
                            </DropdownMenu.Item>

                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <div className="">
                    <DashboardPopOver
                        deleteable={value !== "0"}
                        dashboard={activeDashboard}
                        deleteDashboard={async () => {
                            await deleteDashboard(activeDashboard)
                        }}
                        onUpdate={(title, isPublic) => {
                            updateDashboard(activeDashboard, title, isPublic)
                        }}
                    />
                </div>

            </div>
        </>
    )
}

const DashboardPopOver = ({dashboard, onUpdate: update, deleteDashboard, deleteable}: {
    dashboard: Dashboard,
    deleteable: boolean,
    deleteDashboard: () => Promise<void>,
    onUpdate: (title: string, isPublic: boolean) => void,
}) => {
    const {publicDashboardPath} = useDashboardsState()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(dashboard.name)
    const [isPublic, setIsPublic] = useState(dashboard.public)
    const [view, setView] = useState<"delete" | "edit">("edit")

    const handleUpdate = () => {
        setOpen(false)
        update(name, isPublic)
    }

    useEffect(() => {
        setView("edit")
        setName(dashboard.name)
        setIsPublic(dashboard.public)
    }, [open, dashboard])

    return <Popover.Root open={open}
                         onOpenChange={setOpen}>
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
                {view === "edit" && <div className="flex flex-col gap-2.5">
                    <p className="text-mauve12 text-sm leading-[19px] font-bold mb-2.5">Configuration</p>
                    <fieldset className="flex gap-1 flex-col items-start">
                        <label className="text-sm text-violet11 w-[75px]"
                               htmlFor="width">
                            Domain
                        </label>
                        <input
                            className="w-full inline-flex items-center justify-center flex-1 rounded-sm py-2 px-2 text-sm leading-none text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 shadow-[0_0_0_1px] shadow-zinc-200 dark:shadow-zinc-700 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-zinc-400 dark:focus:shadow-zinc-100/10 outline-none"
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
                    <fieldset className="flex gap-5 py-1 justify-between items-center">
                        <label className="text-sm text-violet11 w-[75px]"
                               htmlFor="maxHeight">
                            Public
                        </label>
                        <Switch value={isPublic}
                                onChange={setIsPublic}/>
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

                    {deleteable && <div
                        className="pt-2 pb-0 cursor-pointer opacity-70 hover:opacity-100 smooth text-center text-red-500 text-xs"
                        onClick={() => setView("delete")}
                    >
                        Delete dashboard
                    </div>}
                </div>}

                {view === "delete" && <div className="flex flex-col gap-2.5">
                    <p className="text-sm font-bold">Delete dashboard</p>
                    <p className="opacity-70 text-sm mb-2.5">
                        This action cannot be undone.
                    </p>
                    <div className="flex flex-col gap-2">
                        <SecondaryButton className="flex-grow"
                                         text={"Cancel"}
                                         onClick={() => setView("edit")}/>
                        <DeleteButton
                            alreadyConfirmed
                            className="flex-grow"
                            text={"Delete"}
                            onClick={async () => {
                                await deleteDashboard()
                                setOpen(false)
                            }}
                        />
                    </div>
                </div>}

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
