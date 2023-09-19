import {useState} from "react";
import {Team, TeamId} from "../types/Team";
import {expirableLocalStorage} from "../helpers/ExpirableLocalStorage";

const CURRENT_TEAM_ID_KEY: string = "nw:current_team"

export type TeamState = {
    currentTeamId: TeamId | null
    setCurrentTeamId: (teamId: TeamId | null) => void
    setCurrentTeamFromTeams: (teams: Team[]) => void
}

export function useTeamState(): TeamState {
    const [currentTeamId, setCurrentTeamId] = useState<TeamId | null>(
        expirableLocalStorage.get(CURRENT_TEAM_ID_KEY, null, true),
    )

    const setCurrentTeamIdAndSave = (teamId: TeamId | null) => {
        expirableLocalStorage.set(CURRENT_TEAM_ID_KEY, teamId)
        setCurrentTeamId(teamId)
    }

    const setCurrentTeamFromTeams = (teams: Team[]) => {
        if (currentTeamId === null && teams.length > 0) {
            setCurrentTeamIdAndSave(teams[0].id)
        }

        if (currentTeamId !== null && teams.length > 0) {
            const team = teams.find((t) => t.id === currentTeamId)
            if (team === undefined) {
                setCurrentTeamIdAndSave(teams[0].id)
            } else {
                setCurrentTeamIdAndSave(team.id)
            }
        }
    }

    return {
        currentTeamId,
        setCurrentTeamId: setCurrentTeamIdAndSave,
        setCurrentTeamFromTeams,
    }
}
