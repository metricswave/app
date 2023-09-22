import React, {useEffect, useState} from "react";
import {useAuthContext} from "../../contexts/AuthContext";
import {Team} from "../../types/Team";
import {DialogComponent} from "../dialog/DialogComponent";
import {DialogHeader} from "../dialog/DialogHeader";
import * as Dialog from "@radix-ui/react-dialog"
import InputFieldBox from "../form/InputFieldBox";
import PrimaryButton from "../form/PrimaryButton";
import {fetchAuthApi} from "../../helpers/ApiFetcher";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {User} from "../../types/User";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import CheckIcon from "../icons/CheckIcon";

export function TeamChooser() {
    const context = useAuthContext()
    const currentTeam: Team | undefined = context.userState.currentTeam(context.teamState.currentTeamId)
    const user: User | null = context.userState.user
    const [creatingTeam, setCreatingTeam] = useState<boolean>(false)
    const [teamDomain, setTeamDomain] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [created, setCreated] = useState<boolean>(false)
    const [teamsCount] = useState<number>(context.userState.user?.all_teams.length || 0)

    useEffect(() => {
        if (!created) return
        if (teamsCount === context.userState.user?.all_teams.length) return

        setTimeout(() => {
            const newTeam = context.userState.user?.all_teams[context.userState.user?.all_teams.length - 1]
            context.teamState.setCurrentTeamId(newTeam?.id || 0)
            setCreatingTeam(false)
            setTeamDomain("")
            setLoading(false)
        }, 500)
    }, [created, context.userState.user?.all_teams.length]);

    if (currentTeam === undefined || user === null) {
        return <></>
    }

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <div className="p-2 w-full flex-grow flex flex-row items-center justify-center rounded-md cursor-pointer bg-[var(--menu-item-hover)] hover:bg-[var(--menu-item-active)]">
                        <div className="w-full pl-1 pr-2">
                            {currentTeam.domain}
                        </div>

                        <ChevronDownIcon/>
                    </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[220px] bg-white dark:bg-zinc-800 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50"
                        sideOffset={5}
                        align={"start"}
                    >
                        {user.all_teams?.sort(a => a.owner_id === user.id ? -1 : 0)
                            .map((team) => (
                                <DropdownMenu.Item
                                    key={team.id}
                                    className="group text-[13px] leading-none rounded-[3px] flex items-center h-[35px] sm:h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-800/20 data-[highlighted]:text-blue-500 dark:data-[highlighted]:text-blue-100"
                                    onSelect={(e) => {
                                        setTimeout(() => context.teamState.setCurrentTeamId(team.id), 100)
                                    }}
                                >
                                    {team.id === currentTeam.id &&
                                        <CheckIcon className="text-green-500 h-auto inline-block w-4 absolute left-0.5"/>
                                    }
                                    {team.domain}
                                </DropdownMenu.Item>
                            ))}

                        <DropdownMenu.Separator className="h-[1px] bg-zinc-400/20 dark:bg-zinc-700 m-[5px]"/>

                        <DropdownMenu.Item
                            className="group text-[13px] leading-none rounded-[3px] flex items-center h-[35px] sm:h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-800/20 data-[highlighted]:text-blue-500 dark:data-[highlighted]:text-blue-100"
                            onSelect={(e) => {
                                setTimeout(() => {
                                    setCreatingTeam(true)
                                }, 100)
                            }}
                        >
                            Create a site
                        </DropdownMenu.Item>

                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DialogComponent open={creatingTeam}>
                <DialogHeader onClose={() => setCreatingTeam(false)}/>

                <div className="flex flex-row space-x-10 mt-5 sm:mt-0 mb-2 justify-between items-start">
                    <div>
                        <Dialog.Title className="font-bold m-0">
                            Create a new team
                        </Dialog.Title>

                        <Dialog.Description className="mt-2 mb-6 opacity-70 text-sm">
                            Choose the domain of the site you want to track.
                        </Dialog.Description>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <InputFieldBox
                        placeholder={"Team domain"}
                        name="teamDomain"
                        setValue={setTeamDomain}
                        label="Team domain"
                        value={teamDomain}
                        error={error}
                        focus
                    />

                    <PrimaryButton
                        className="w-full"
                        text={"Save"}
                        loading={loading}
                        onClick={() => {
                            if (teamDomain === "") {
                                setError("Please enter a domain")
                                return
                            }

                            if (teamDomain.includes(" ") || !teamDomain.includes(".") || teamDomain.includes("/")) {
                                setError("Please enter a valid domain. Example: metricswave.com")
                                return
                            }

                            setLoading(true)
                            fetchAuthApi(`/teams/`, {
                                method: "POST",
                                body: {domain: teamDomain},
                                success: () => {
                                    context.userState.refreshUser(true)
                                    context.teamState.loadTeams(true)
                                    setCreated(true)
                                },
                            })
                        }}
                    />
                </div>

            </DialogComponent>
        </>
    )
}
