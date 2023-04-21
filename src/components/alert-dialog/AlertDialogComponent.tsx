import * as AlertDialog from "@radix-ui/react-alert-dialog"

type Props = {
    children: React.ReactNode
    title: string
    description: string
    confirmButton: string
    onConfirm: () => void
}

export default function AlertDialogComponent({children, title, description, confirmButton, onConfirm}: Props) {
    return (
            <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                    {children}
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="bg-black/20 dark:bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-30"/>
                    <AlertDialog.Content className="data-[state=open]:animate-contentSlideFromBottom sm:data-[state=open]:animate-contentShow fixed bottom-0 sm:bottom-auto sm:top-[50%] left-[50%] max-h-[90vh] h-[90vh] sm:h-auto w-[98vw] max-w-[540px] translate-x-[-50%] sm:translate-y-[-50%] rounded-t sm:rounded-b bg-white dark:bg-zinc-900 p-6 shadow z-40 focus:outline-none">
                        <AlertDialog.Title className="font-bold m-0 text-xl">
                            {title}
                        </AlertDialog.Title>
                        <AlertDialog.Description className="mt-2 mb-6 opacity-70">
                            {description}
                        </AlertDialog.Description>
                        <div className="flex justify-end gap-[25px] pt-4">
                            <AlertDialog.Cancel asChild>
                                <button className="smooth h-[35px] px-3 opacity-70 hover:opacity-100">
                                    Cancel
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button onClick={onConfirm}
                                        className="smooth rounded h-[35px] px-3 border shadow text-red-500 border-red-500 hover:text-white hover:bg-red-500 hover:shadow">
                                    {confirmButton}
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
    )
}
