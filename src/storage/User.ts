import { useEffect, useState } from "react";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import { User } from "../types/User";
import { expirableLocalStorage, THIRTY_SECONDS } from "../helpers/ExpirableLocalStorage";
import { Team, TeamId } from "../types/Team";

const USER_REFRESH_KEY: string = "nw:user:refresh:v4";
const USER_KEY: string = "nw:user:v4";

export const getUser = (): User | null => {
    return expirableLocalStorage.get(USER_KEY, null);
};

export type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;
    refreshUser: (force?: boolean) => void;
    expired: boolean;
    setExpired: (expired: boolean) => void;
    currentTeam: (id: TeamId | null) => Team | undefined;
};

export function useUserState(): UserState {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(getUser());
    const [expired, setExpired] = useState(false);
    const [isFreshUser, setIsFreshUser] = useState<true | false>(expirableLocalStorage.get(USER_REFRESH_KEY, false));

    const refreshUser = (force = false) => {
        if (isFreshUser && !force) return;

        fetchAuthApi<User>("/users", {
            success: (data) => {
                expirableLocalStorage.set(USER_REFRESH_KEY, true, THIRTY_SECONDS);
                expirableLocalStorage.set(USER_KEY, data.data);
                setUser(data.data);
                setIsFreshUser(true);
                setExpired(false);
            },
            finally: () => {
                setExpired(true);
            },
        });
    };

    useEffect(() => {
        if (user !== null && isFreshUser) return;
        refreshUser();
    }, [isAuth]);

    return {
        user,
        setUser,
        isAuth,
        setIsAuth,
        refreshUser,
        expired,
        setExpired,
        currentTeam: (id: null | TeamId): Team | undefined => {
            if (user === null || id === null) return undefined;
            return user.all_teams.find((t) => t.id === id);
        },
    };
}
