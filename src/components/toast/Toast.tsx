import * as React from "react"
import * as ToastUi from "@radix-ui/react-toast"
import {twMerge} from "../../helpers/TwMerge"

type Props = {
    open: boolean,
    title: string,
    description?: string
}

export const Toast = ({open, title, description}: Props) => {
    const timerRef = React.useRef(0)

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current)
    }, [])

    return (
        <ToastUi.Provider swipeDirection="right">
            <ToastUi.Root
                className="bg-white dark:bg-zinc-800 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-3 grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                open={open}
            >
                <ToastUi.Title className={twMerge(
                    "[grid-area:_title] font-medium text-sm",
                    {"mb-1": description},
                )}>
                    {title}
                </ToastUi.Title>
                {description && <ToastUi.Description asChild>
                    {description}
                </ToastUi.Description>}
            </ToastUi.Root>
            <ToastUi.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none"/>
        </ToastUi.Provider>
    )
}
