import {Team} from "./Team";

export type User = {
    id: number
    name: string
    email: string
    all_teams: Team[]
}
