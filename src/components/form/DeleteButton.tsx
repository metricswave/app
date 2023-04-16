import React from "react"

type Props = {
    text: string,
    loading?: boolean
    onClick: () => Promise<void>
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function DeleteButton({text, onClick: clicked, ...props}: Props) {
    const [confirmed, setConfirmed] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false)

    return (
            <button
                    {...props}
                    className={[
                        `smooth rounded-sm p-3 border shadow`,
                        (loading ? "animate-pulse bg-zinc-500 cursor-not-allowed" : (
                                !confirmed ?
                                        "text-red-500 border-red-500 hover:text-white hover:bg-red-500 hover:shadow" :
                                        "text-white bg-red-500 hover:bg-red-600"
                        )),
                        props.className ?? "",
                    ].join(" ")}
                    onClick={async () => {
                        if (confirmed) {
                            setLoading(true)
                            await clicked()
                            setLoading(false)
                            return
                        }

                        setConfirmed(true)
                    }}
            >
                {!confirmed ? text : "Are you sure?"}
            </button>
    )
}
