import {SecondaryNoLinkButton} from "../buttons/LinkButton"
import * as Dialog from "@radix-ui/react-dialog"

type Props = {
    back?: () => void,
    onClose?: () => void,
}

export const DialogHeader = ({back, onClose, ...props}: Props) => {
    return (
        <div className="flex flex-row space-x-10 mt-0 mb-2 justify-between items-center">
            <div>
                {back !== undefined && <SecondaryNoLinkButton text="← Back"
                                                              onClick={back}/>}
            </div>

            <Dialog.Close asChild
                          className="">
                <button
                    className="inline-flex h-[35px] w-[35px] appearance-none items-center justify-center rounded-sm focus:outline-none bg-blue-50/50 hover:bg-blue-50 dark:bg-zinc-500/10 hover:dark:bg-blue-500/20 smooth"
                    aria-label="Close"
                    onClick={() => {
                        if (onClose !== undefined) {
                            onClose()
                        }
                    }}
                >
                    <span className="rotate-45">+</span>
                </button>
            </Dialog.Close>
        </div>
    )
}
