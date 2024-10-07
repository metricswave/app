import {DefinedAuthContextType, useAuthContext} from "../../contexts/AuthContext"
import LoadingPage from "../LoadingPage";
import InputFieldBox from "../../components/form/InputFieldBox";
import React, {useEffect, useState} from "react";
import {User} from "../../types/User";
import DeleteButton from "../../components/form/DeleteButton";
import PrimaryButton from "../../components/form/PrimaryButton";
import AnimateHeight from "react-animate-height";
import {fetchAuthApi} from "../../helpers/ApiFetcher";
import {useTeamInvitesState} from "../../storage/TeamInvites";
import {TeamInvite} from "../../types/Team";
import SectionContainer from "../../components/sections/SectionContainer";
import {useNavigate} from "react-router-dom";
import DropDownSelectFieldBox from "../../components/form/DropDownSelectFieldBox";

export default function TeamSettings() {
    const context = useAuthContext()
    const navigate = useNavigate()
    const {user, refreshUser} = context.userState
    const {teams, currentTeamId, loadTeams} = context.teamState
    const {invites, loadInvites} = useTeamInvitesState()
    const team = teams.find(team => team.id === currentTeamId)
    const [teamDomain, setTeamDomain] = useState<string>(team?.domain || "")
    const [teamCurrency, setTeamCurrency] = useState<string>(team?.currency || "USD")
    const [error, setError] = useState<string>("")
    const [sendingTeamForm, setSendingTeamForm] = useState<boolean>(false)
    const [formChanged, setFormChanged] = useState<boolean>(false)

    useEffect(() => {
        setTeamDomain(team?.domain || "")
    }, [team, currentTeamId]);

    useEffect(() => {
        setFormChanged(teamDomain !== team?.domain || teamCurrency !== team?.currency)
    }, [team, teamDomain, teamCurrency]);

    useEffect(() => {
        if (sendingTeamForm) {
            setFormChanged(false)
            setSendingTeamForm(false)
        }
    }, [teams, user]);

    useEffect(loadTeams);

    if (teams.length === 0 || team === undefined) {
        return <LoadingPage/>
    }

    return (<SectionContainer
        align={"left"}
        size={"big"}
    >
        <div className="flex flex-col space-y-6 max-w-content">
            <h1 className="font-bold">Site: {team.domain}</h1>

            <div className="flex flex-col gap-6 md:gap-10">
                <div className="flex flex-col gap-2">
                    <InputFieldBox
                        placeholder={"Site domain"}
                        name="teamDomain"
                        setValue={setTeamDomain}
                        label="Site domain"
                        value={teamDomain}
                        error={error}
                    />

                    <DropDownSelectFieldBox
                        name="currency"
                        value={teamCurrency}
                        label="Currency"
                        options={[
                            {value: "usd", label: "USD"},
                            {value: "eur", label: "EUR"},
                        ]}
                        setValue={(value) => setTeamCurrency(value as string)}
                    />

                    <AnimateHeight id={`domain-save-button`}
                                   height={formChanged ? "auto" : 0}
                                   duration={300}>
                        <PrimaryButton
                            className="w-full"
                            text={"Save"}
                            loading={sendingTeamForm}
                            onClick={() => {
                                if (teamDomain === "") {
                                    setError("Please enter a domain")
                                    return
                                }

                                if (teamDomain.includes(" ") || !teamDomain.includes(".") || teamDomain.includes("/")) {
                                    setError("Please enter a valid domain. Example: metricswave.com")
                                    return
                                }

                                setSendingTeamForm(true)
                                fetchAuthApi(`/teams/${currentTeamId}`, {
                                    method: "PUT",
                                    body: {domain: teamDomain, currency: teamCurrency},
                                    success: () => {
                                        loadTeams(true)
                                        refreshUser(true)
                                    },
                                })
                            }}
                        />
                    </AnimateHeight>
                </div>

                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-2">
                        <div className="font-bold">
                            Users
                        </div>

                        <UserRow
                            key={"owner"}
                            user={team.owner}
                            role={"owner"}
                            teamId={team.id}
                        />

                        {team.users.map(user => (<UserRow
                            user={user}
                            role={"member"}
                            key={user.id}
                            teamId={team.id}
                            onDeleted={() => {
                                if (user.id === context.userState.user?.id) {
                                    context.userState.refreshUser(true)
                                    navigate('/')
                                } else {
                                    loadTeams(true)
                                }
                            }}
                        />))}

                        {invites.map(invite => (<InviteRow
                            key={invite.id + invite.email}
                            invite={invite}
                            onRevoked={() => loadInvites(true)}
                        />))}
                    </div>

                    <NewInviteRow onInvite={() => loadInvites(true)} />
                </div>

                {team.owner.id === context.userState.user?.id &&
                    <DeleteContainer teamId={team.id} context={context} />
                }
            </div>
        </div>
    </SectionContainer>)
}

function DeleteContainer({teamId, context}: { teamId: number, context: DefinedAuthContextType }) {
    const navigate = useNavigate()

    return <>
        <div className='flex flex-col gap-4 border soft-border p-4'>
            <div className="flex flex-col gap-1">
                <p><strong>You can't not undo this action.</strong></p>
                <p className="text-sm">All the team information, statistic, triggers, etc will be gone for ever.</p>
            </div>

            <DeleteButton
                onClick={async () => {
                    context.teamState.deleteTeam(teamId)
                        .then(() => {
                            context.userState.refreshUser(true)
                            navigate('/')
                        })
                }}
                text="Delete Site"
                className="w-full"
            />
        </div>
    </>
}

function UserRow({user, teamId, role, onDeleted}: {
    teamId: number,
    user: User,
    role: "owner" | "member",
    onDeleted?: () => void
}) {
    const {user: currentUser} = useAuthContext().userState

    return (
        <div className="flex flex-row justify-between items-center p-3 rounded-sm border soft-border">
            <div className="flex flex-col items-start gap-1">
                <div className="flex flex-row gap-2 text-sm items-baseline">
                    <span>{user.name}</span>
                    <UserTag
                        role={role}
                        user={user}
                        currentUser={currentUser}
                    />
                </div>
                <div className="opacity-60 text-xs">{user.email}</div>
            </div>

            <div>
                {role !== "owner" && <DeleteButton
                    text={currentUser?.id === user.id ? "Leave Site" : "Remove"}
                    className="text-sm py-1 px-1.5 border-none shadow-none"
                    onClick={async () => {
                        fetchAuthApi(`/teams/${teamId}/users/${user.id}`, {
                            method: "DELETE",
                            success: () => {
                                onDeleted?.()
                            },
                        })
                    }}
                />}
            </div>
        </div>
    )
}

function UserTag({currentUser, role, user}: { currentUser: User | null, role: "owner" | "member", user: User }) {
    if (currentUser?.id === user.id) return <span className="text-xs opacity-50">(You)</span>
    else if (role === "owner") return <span className="text-xs opacity-50">(Owner)</span>
    else return <></>
}

function InviteRow({invite, onRevoked}: { invite: TeamInvite, onRevoked?: () => void }) {
    return (
        <div className="flex flex-row justify-between items-center p-3 rounded-sm border soft-border text-sm">
            <div>{invite.email} <span className="opacity-50">(Invited)</span></div>

            <div>
                <DeleteButton
                    text="Revoke"
                    className="text-sm py-1 px-1.5 border-none shadow-none"
                    onClick={async () => {
                        fetchAuthApi(`/teams/${invite.team_id}/invites/${invite.id}`, {
                            method: "DELETE",
                            success: () => {
                                onRevoked?.()
                            },
                        })
                    }}
                />
            </div>
        </div>
    )
}

function NewInviteRow({onInvite}: { onInvite?: () => void }) {
    const {currentTeamId} = useAuthContext().teamState
    const [inviting, setInviting] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="font-bold">Invite new user</p>
                <p className="text-sm opacity-70">
                    Share current team dashboards, triggers, and channels with an other user. This user will be able to
                    access all the data that belongs to this current team. You can revoke the invitation or remove the
                    user from the group at any moment.
                </p>
            </div>

            <div className="flex flex-row gap-2 p-3 rounded-sm border soft-border">
                <InputFieldBox
                    placeholder={"Email"}
                    name="email"
                    setValue={setEmail}
                    inputClassName="p-2"
                    value={email}
                />

                <PrimaryButton
                    className="max-w-[200px] p-1 w-full"
                    text={"Invite"}
                    loading={inviting}
                    onClick={() => {
                        setInviting(true)

                        fetchAuthApi(`/teams/${currentTeamId}/invites`, {
                            method: "POST",
                            body: {email},
                            success: () => {
                                setEmail("")
                                setInviting(false)
                                onInvite?.()
                            }
                        })
                    }}
                />
            </div>
        </div>
    )
}
