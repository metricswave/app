import {useState} from "react";
import {Team, TeamId} from "../types/Team";
import {expirableLocalStorage, FIVE_SECONDS} from "../helpers/ExpirableLocalStorage";
import {fetchAuthApi} from "../helpers/ApiFetcher";

const CURRENT_TEAM_ID_KEY: string = "nw:current_team"

export type TeamState = {
    teams: Team[],
    loadTeams: (force?: boolean) => void
    currentTeamId: TeamId | null
    setCurrentTeamId: (teamId: TeamId | null) => void
    setCurrentTeamFromTeams: (teams: Team[]) => void
}

export function useTeamState(): TeamState {
    const CACHE_KEY = "nw:teams"
    const [teams, setTeams] = useState<Team[]>(
        expirableLocalStorage.get(CACHE_KEY, [], true),
    )
    const [currentTeamId, setCurrentTeamId] = useState<TeamId | null>(
        expirableLocalStorage.get(CURRENT_TEAM_ID_KEY, null, true),
    )

    const loadTeams = (force = false) => {
        const cachedTeams = expirableLocalStorage.get(CACHE_KEY, false)
        if (cachedTeams !== false && !force) {
            setTeams(cachedTeams)
            return
        }

        fetchAuthApi<Team[]>("/teams", {
            success: (data) => {
                setTeams(data.data)
                expirableLocalStorage.set(CACHE_KEY, data.data, FIVE_SECONDS)
            },
        });
    }

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
        teams,
        loadTeams,
        setCurrentTeamId: setCurrentTeamIdAndSave,
        setCurrentTeamFromTeams,
    }
}
