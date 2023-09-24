import ServiceIcon from "../icons/ServiceIcon"
import React from "react"
import {DeleteNoLinkButton} from "../buttons/LinkButton"
import AlertDialogComponent from "../alert-dialog/AlertDialogComponent"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {Channel} from "../../types/Channel";
import {useAuthContext} from "../../contexts/AuthContext";
import {TeamChannel, TelegramTeamChannel} from "../../types/TeamChannels";

type Props = {
    teamChannel: TeamChannel,
    channel: Channel,
    onDeleted: () => void,
}

export default function UserChannelBlock({teamChannel, channel, onDeleted: deleted}: Props) {
    const {currentTeamId} = useAuthContext().teamState
    const [loading, setLoading] = React.useState(false)

    const deleteService = () => {
        setLoading(true)

        fetchAuthApi(`/teams/${currentTeamId}/channels/${teamChannel.id}`, {
            "method": "DELETE",
            "success": () => deleted(),
            "error": () => setLoading(false),
            "catcher": () => setLoading(false),
        })
    }

    return (
        <div className={[
            "flex flex-col space-y-4 rounded-sm p-4 border text-sm sm:text-base",
            "soft-border",
        ].join(" ")}>

            <div className="flex flex-row items-start justify-start space-x-4">

                <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                    <ServiceIcon driver={channel.driver}
                                 className="dark:text-white"/>
                </div>

                <div className="flex flex-col items-start justify-between space-y-1 w-full">
                    <h2 className="font-bold flex flex-row items-center space-x-3">
                        <span>{channel.name}</span>
                    </h2>

                    { // Show channel name if it's a telegram service
                        channel.configuration.type === "form"
                        && channel.driver === "telegram"
                        && (teamChannel as TelegramTeamChannel).data.configuration["channel_name"] !== undefined
                        && (
                            <div className="text-sm opacity-70">
                                Channel: {(teamChannel as TelegramTeamChannel).data.configuration["channel_name"]}
                            </div>
                        )
                    }

                    <div className="flex flex-row items-center justify-between w-full pt-1">
                        <div className="text-sm opacity-70 text-green-600 dark:text-green-500 flex flex-row space-x-2 font-bold">
                            <span>Connected</span>
                        </div>

                        <div>
                            <AlertDialogComponent
                                title="Are you sure?"
                                description="This action can't be undone. You are going to remove this connection for ever."
                                onConfirm={deleteService}
                                confirmButton="Yes, delete"
                            >
                                <div>
                                    <DeleteNoLinkButton text={"Remove"}
                                                        loading={loading}/>
                                </div>
                            </AlertDialogComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
