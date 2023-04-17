import React from "react"
import * as Dialog from "@radix-ui/react-dialog"

interface DialogComponentProps {
    children: React.ReactNode
    title?: string
    button?: React.ReactNode
    description?: string
    innerRef?: React.RefObject<HTMLDivElement>
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export const DialogComponent = (
        {
            button,
            title,
            innerRef,
            description,
            children,
            open = undefined,
            defaultOpen = false,
            onOpenChange = (open: boolean) => null,
            ...props
        }: DialogComponentProps,
) => (
        <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            {button !== undefined &&
                    <Dialog.Trigger asChild>
                        <div>
                            {button}
                        </div>
                    </Dialog.Trigger>
            }

            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/20 dark:bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-30"/>
                <Dialog.Content
                        className="data-[state=open]:animate-contentSlideFromBottom sm:data-[state=open]:animate-contentShow fixed bottom-0 sm:bottom-auto sm:top-[50%] left-[50%] max-h-[90vh] h-[90vh] sm:h-auto w-[98vw] max-w-[540px] translate-x-[-50%] sm:translate-y-[-50%] rounded-t sm:rounded-b bg-white dark:bg-zinc-900 pt-6 shadow z-40 focus:outline-none">
                    {title && <div className="flex flex-row space-x-10 mt-5 mb-2 px-6">
                        <div>
                            <Dialog.Title className="font-bold m-0 text-xl">
                                {title}
                            </Dialog.Title>

                            {description && <Dialog.Description className="mt-2 mb-6 opacity-70">
                                {description}
                            </Dialog.Description>}
                        </div>

                        <Dialog.Close asChild className="px-6 hidden sm:block">
                            <button
                                    className="inline-flex h-[35px] w-[35px] aspect-square appearance-none items-center justify-center rounded-full focus:outline-none bg-blue-50/50 hover:bg-blue-50 smooth"
                                    aria-label="Close"
                            >
                                <span className="rotate-45">+</span>
                            </button>
                        </Dialog.Close>
                    </div>}

                    <div className="max-h-full sm:max-h-[85vh] overflow-y-scroll px-6 pb-6">
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
)
