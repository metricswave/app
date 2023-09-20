import DropDownSelectFieldBox from "../form/DropDownSelectFieldBox";
import React from "react";
import {useAuthContext} from "../../contexts/AuthContext";
import {Team} from "../../types/Team";

export function TeamChooser() {
    const context = useAuthContext()
    const currentTeam: Team | undefined = context.userState.currentTeam(context.teamState.currentTeamId)

    if (currentTeam === undefined || context.userState.user === null) {
        return <></>
    }

    return (
        <DropDownSelectFieldBox
            className={"text-sm border-none p-0 bg-[--menu-item-hover] hover:bg-[var(--menu-item-active)] smooth-all"}
            wrapperClassName={"p-0 opacity-80 hover:opacity-100"}
            selectClassName={"pr-2 mx-2 py-2"}
            value={currentTeam.id.toString()}
            options={
                context.userState.user?.all_teams?.map((team) => {
                    return {
                        label: team.domain,
                        value: team.id.toString(),
                    }
                })
            }
            setValue={
                (value) => {
                    context.teamState.setCurrentTeamId(parseInt(value as string))
                }
            }
            name="team"
        />
    )
}
