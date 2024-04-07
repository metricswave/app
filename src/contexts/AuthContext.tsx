import React, {useContext, useEffect} from "react"
import {UserState, useUserState} from "../storage/User";
import {TeamState, useTeamState} from "../storage/Team";

export type AuthContextType = null | DefinedAuthContextType
export type DefinedAuthContextType = {
    userState: UserState,
    teamState: TeamState
}
export const AuthContext = React.createContext<AuthContextType>(null)

export function AuthContextProvider({children}: { children: React.ReactNode }) {
    return (
        <AuthContext.Provider value={{userState: useUserState(), teamState: useTeamState()}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)

    if (context === null) {
        throw new Error("useAuthContext must be used within an AuthContextProvider")
    }

    useEffect(() => {
        if (context.userState.user === null) {
            return
        }

        context.teamState.setCurrentTeamFromTeams(context.userState.user, context.userState.user.all_teams)
    }, [context.userState.user])

    return context
}
