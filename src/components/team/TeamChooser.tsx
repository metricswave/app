import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox";
import React, {useEffect, useState} from "react";
import {useAuthContext} from "../../contexts/AuthContext";
import {Team} from "../../types/Team";
import {DialogComponent} from "../dialog/DialogComponent";
import {DialogHeader} from "../dialog/DialogHeader";
import * as Dialog from "@radix-ui/react-dialog"
import InputFieldBox from "../form/InputFieldBox";
import PrimaryButton from "../form/PrimaryButton";
import {fetchAuthApi} from "../../helpers/ApiFetcher";

export function TeamChooser() {
    const context = useAuthContext()
    const currentTeam: Team | undefined = context.userState.currentTeam(context.teamState.currentTeamId)
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

    if (currentTeam === undefined || context.userState.user === null) {
        return <></>
    }

    return (
        <>
            <DropDownSelectFieldBox
                className={"text-sm border-none p-0 bg-[--menu-item-hover] hover:bg-[var(--menu-item-active)] smooth-all"}
                wrapperClassName={"p-0 opacity-80 hover:opacity-100"}
                selectClassName={"pr-2 mx-2 py-2"}
                value={currentTeam.id.toString()}
                options={[
                    ...context.userState.user?.all_teams?.map((team) => {
                        return {
                            label: team.domain,
                            value: team.id.toString(),
                        }
                    }),
                    {
                        label: "Create a New Team",
                        value: "create",
                    }
                ]}
                setValue={
                    (value) => {
                        if (value === "create") {
                            setCreatingTeam(true)
                            return
                        }

                        context.teamState.setCurrentTeamId(parseInt(value as string))
                    }
                }
                name="team"
            />

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
