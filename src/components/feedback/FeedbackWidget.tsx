import {ChatBubbleIcon} from "@radix-ui/react-icons"
import {DialogComponent} from "../dialog/DialogComponent"
import TextareaFieldBox from "../form/TextareaFieldBox"
import {useState} from "react"
import PrimaryButton from "../form/PrimaryButton"
import eventTracker from "../../helpers/EventTracker"
import {useUserState} from "../../storage/User"


export function FeedbackWidget() {
    const {user} = useUserState(true)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    return (<>
        <DialogComponent
            title={"Feedback"}
            description={"We'd love to hear from you!"}
            open={open}
            onOpenChange={setOpen}
            button={<div className="fixed bottom-[6.4rem] sm:bottom-4 right-4 z-50">
                <button
                    className={[
                        "rounded-full p-5 shadow-lg bg-blue-50 dark:bg-zinc-900 hover:bg-blue-100 smooth cursor-pointer shadow-blue-900/20 dark:shadow-black/50 border-blue-100 dark:border-blue-500/10 border hover:border-blue-200 dark:hover:bg-zinc-800 dark:hover:border-blue-500/30",
                        open === true ? "hidden" : "",
                    ].join(" ")}
                >
                    <ChatBubbleIcon className="text-blue-900 dark:text-blue-100/50 w-5 h-auto"/>
                </button>
            </div>}
        >
            <div className="flex flex-col gap-2">
                <TextareaFieldBox
                    value={message}
                    focus
                    setValue={setMessage}
                    label="Feedback"
                    name="feedback"
                    placeholder="What's on your mind?"
                    error={error}
                />
                <PrimaryButton
                    text="Send Feedback"
                    onClick={() => {
                        if (message.length < 10) {
                            setError("Please enter at least 10 characters")
                            return
                        }

                        eventTracker.track("20ad1003-03d6-49c2-a973-42515e70ddb1", {
                            message,
                            email: user?.email ?? "Unknown user",
                        })
                        setOpen(false)
                    }}
                />

            </div>
        </DialogComponent>
    </>)
}
