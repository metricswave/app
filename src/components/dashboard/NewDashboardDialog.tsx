import * as Dialog from "@radix-ui/react-dialog"
import React, {useState} from "react"
import PrimaryButton from "../form/PrimaryButton"
import InputFieldBox from "../form/InputFieldBox"
import {Cross2Icon} from "@radix-ui/react-icons"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {useAuthContext} from "../../contexts/AuthContext";

export const NewDashboardDialog = ({open, setOpen, created}: {
    open: boolean,
    setOpen: (status: boolean) => void,
    created: () => void,
}) => {
    const {currentTeamId} = useAuthContext().teamState
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState<string>("")
    const [nameError, setNameError] = useState<string | false>(false)

    const handleCreation = () => {
        if (name === "") {
            setNameError("Name cannot be empty")
            return
        }

        if (name.length < 3) {
            setNameError("Name must be at least 3 characters long")
            return
        }

        setNameError(false)

        fetchAuthApi(
            `/${currentTeamId}/dashboards`,
            {
                method: "POST",
                body: {name, items: []},
                success: created,
                error: (error) => null,
                catcher: (error) => null,
            },
        )
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={setOpen}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/25 z-30 data-[state=open]:animate-overlayShow fixed inset-0"/>
                <Dialog.Content className="z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white dark:bg-zinc-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none flex flex-col gap-3">
                    <Dialog.Title className="m-0 font-medium">
                        Create a new dashboard
                    </Dialog.Title>
                    <Dialog.Description className="opacity-75 pb-3 text-sm leading-normal">
                        Create a new dashboard to organize your widgets.
                    </Dialog.Description>

                    <InputFieldBox
                        setValue={setName}
                        value={name}
                        label={"Domain"}
                        placeholder={"Dashboard name"}
                        name={"name"}
                        error={nameError}
                        onKeyPress={e => e.key === "Enter" && handleCreation()}
                        focus
                    />

                    <Dialog.Close asChild>
                        <><PrimaryButton
                            loading={loading}
                            text={"Create"}
                            className="w-full"
                            onClick={handleCreation}
                        /></>
                    </Dialog.Close>

                    <Dialog.Close asChild>
                        <button
                            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                        >
                            <Cross2Icon/>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
