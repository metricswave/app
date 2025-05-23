import { useState } from "react";
import { Team, TeamId } from "../types/Team";
import { expirableLocalStorage, FIVE_SECONDS } from "../helpers/ExpirableLocalStorage";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import { User } from "../types/User";
import { getUser } from "./User";

const CURRENT_TEAM_ID_KEY: string = "nw:current_team";
const CACHE_KEY: string = "nw:teams";

export type TeamState = {
    teams: Team[];
    team: (teamId?: null | TeamId) => Team | undefined;
    loadTeams: (force?: boolean) => void;
    currentTeamId: TeamId | null;
    setCurrentTeamId: (teamId: TeamId | null) => void;
    setCurrentTeamFromTeams: (user: User, teams: Team[]) => void;
    deleteTeam: (teamId: TeamId) => Promise<void>;
};

export function currentTeamCurrency(): null | string {
    const currentTeamId = expirableLocalStorage.get(CURRENT_TEAM_ID_KEY, null, true);
    const user = getUser();

    if (currentTeamId === null || user === null) {
        return null;
    }

    const team = user.all_teams.find((t) => t.id === currentTeamId);

    if (team === undefined) {
        return null;
    }

    return team.currency;
}

export function useTeamState(): TeamState {
    const [teams, setTeams] = useState<Team[]>(expirableLocalStorage.get(CACHE_KEY, [], true));
    const [currentTeamId, setCurrentTeamId] = useState<TeamId | null>(
        expirableLocalStorage.get(CURRENT_TEAM_ID_KEY, null, true),
    );

    const loadTeams = (force = false) => {
        const cachedTeams = expirableLocalStorage.get(CACHE_KEY, false);
        if (cachedTeams !== false && !force) {
            setTeams(cachedTeams);
            return;
        }

        fetchAuthApi<Team[]>("/teams", {
            success: (data) => {
                setTeams(data.data);
                expirableLocalStorage.set(CACHE_KEY, data.data, FIVE_SECONDS);
            },
        });
    };

    const setCurrentTeamIdAndSave = (teamId: TeamId | null) => {
        expirableLocalStorage.set(CURRENT_TEAM_ID_KEY, teamId);
        setCurrentTeamId(teamId);
    };

    const setCurrentTeamFromTeams = (user: User, teams: Team[]) => {
        if (currentTeamId === null && teams.length > 0) {
            const firstOwnedTeam = teams.sort((a) => (a.owner_id === user.id ? -1 : 1))[0];
            setCurrentTeamIdAndSave(firstOwnedTeam.id);
        }

        if (currentTeamId !== null && teams.length > 0) {
            const team = teams.find((t) => t.id === currentTeamId);
            if (team === undefined) {
                setCurrentTeamIdAndSave(teams[0].id);
            } else {
                setCurrentTeamIdAndSave(team.id);
            }
        }
    };

    const deleteTeam = async (teamId: TeamId): Promise<void> => {
        await fetchAuthApi(`/teams/${teamId}`, {
            method: "DELETE",
            success: () => {
                const newTeams = teams.filter((t) => t.id !== teamId);

                setTeams(newTeams);
                expirableLocalStorage.set(CACHE_KEY, newTeams, FIVE_SECONDS);
                setCurrentTeamId(newTeams.length > 0 ? newTeams[0].id : null);
            },
        });

        return;
    };

    const team = (teamId: null | TeamId = null): Team | undefined => {
        teamId = teamId ?? currentTeamId;
        return teams.find((t) => t.id === teamId);
    };

    return {
        currentTeamId,
        teams,
        loadTeams,
        setCurrentTeamId: setCurrentTeamIdAndSave,
        setCurrentTeamFromTeams,
        deleteTeam,
        team,
    };
}
