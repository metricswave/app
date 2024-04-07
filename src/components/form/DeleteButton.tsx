import React from "react"
import {CheckIcon, TrashIcon} from "@radix-ui/react-icons"
import {twMerge} from "../../helpers/TwMerge";

type Props = {
    text?: string,
    loading?: boolean
    justIcon?: boolean
    alreadyConfirmed?: boolean
    onClick: () => Promise<void>
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function DeleteButton(
    {
        text,
        justIcon = false,
        alreadyConfirmed = false,
        onClick: clicked,
        ...props
    }: Props,
) {
    const [confirmed, setConfirmed] = React.useState<boolean>(alreadyConfirmed)
    const [loading, setLoading] = React.useState<boolean>(false)

    return (
        <button
            {...props}
            className={twMerge(
                `smooth rounded-sm p-3 border shadow`,
                {"animate-pulse bg-zinc-500 cursor-not-allowed": loading},
                {"text-white border-red-500 bg-red-500 hover:bg-red-600": !loading && confirmed},
                {"text-red-500 border-red-500 hover:text-white hover:bg-red-500 hover:shadow": !loading && !confirmed},
                props.className,
            )}
            onClick={async () => {
                if (confirmed) {
                    setLoading(true)
                    await clicked()
                    setLoading(false)
                    setConfirmed(false)
                    return
                }

                setConfirmed(true)
            }}
        >
            {!confirmed && (
                justIcon ? <TrashIcon/> : (text ?? "Delete")
            )}
            {confirmed && (
                justIcon ? <CheckIcon/> : "Are you sure?"
            )}
        </button>
    )
}
