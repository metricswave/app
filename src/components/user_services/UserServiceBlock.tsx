import ServiceIcon from "../icons/ServiceIcon"
import React from "react"
import {TelegramUserService, UserService} from "../../types/UserService"
import {Service} from "../../types/Service"
import {DeleteNoLinkButton} from "../buttons/LinkButton"
import AlertDialogComponent from "../alert-dialog/AlertDialogComponent"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {LinkBreak2Icon} from "@radix-ui/react-icons"

type Props = {
    userService: UserService,
    service: Service,
    onDeleted: () => void,
    connectService: (service: Service) => void
}

export default function UserServiceBlock({userService, service, connectService, onDeleted: deleted}: Props) {
    const [loading, setLoading] = React.useState(false)

    const deleteService = () => {
        setLoading(true)

        fetchAuthApi(`/users/services/${userService.id}`, {
            "method": "DELETE",
            "success": () => deleted(),
            "error": () => setLoading(false),
            "catcher": () => setLoading(false),
        })
    }

    return (
        <div className={[
            "flex flex-col space-y-4 rounded-sm p-4 border text-sm sm:text-base",
            userService.reconectable ?
                "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-600/10" :
                "soft-border",
        ].join(" ")}>

            <div className="flex flex-row items-start justify-start space-x-4">

                <div className="text-3xl w-12 h-12 flex items-center justify-center p-2 bg-zinc-900/10 dark:bg-white/10 rounded-sm">
                    <ServiceIcon driver={service.driver} className="dark:text-white"/>
                </div>

                <div className="flex flex-col items-start justify-between space-y-1 w-full">
                    <h2 className="font-bold flex flex-row items-center space-x-3">
                        <span>{service.name}</span>
                        {userService.reconectable ? <LinkBreak2Icon className="text-red-500"/> : ""}
                    </h2>

                    { // Show channel name if it's a telegram service
                        service.configuration.type === "form"
                        && service.driver === "telegram"
                        && (userService as TelegramUserService).service_data.configuration["channel_name"] !== undefined
                        && (
                            <div className="text-sm opacity-70">
                                Channel: {(userService as TelegramUserService).service_data.configuration["channel_name"]}
                            </div>
                        )
                    }

                    <div className="flex flex-row items-center justify-between w-full pt-1">
                        <div className="text-sm opacity-70 text-green-600 dark:text-green-500 flex flex-row space-x-2 font-bold">
                            {userService.reconectable ?
                                <span
                                    onClick={() => connectService(service)}
                                    className="text-red-600 border-b border-dotted border-red-600 dark:text-red-500 dark:border-red-500 hover:border-solid hover:text-red-500 dark:hover:text-red-400 cursor-pointer">
                                    Reconnect
                                </span> :
                                <span>Connected</span>
                            }
                        </div>

                        <div>
                            <AlertDialogComponent
                                title="Are you sure?"
                                description="This action can't be undone. You are going to remove this connection for ever."
                                onConfirm={deleteService}
                                confirmButton="Yes, delete"
                            >
                                <div>
                                    <DeleteNoLinkButton text={"Remove"} loading={loading}/>
                                </div>
                            </AlertDialogComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
