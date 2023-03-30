import React from "react"
import Logo from "../logo/Logo"

export default function Authentication({children, footer}: { children: React.ReactNode, footer?: React.ReactNode }) {
    return (
            <div className="w-full min-h-screen flex bg-white dark:bg-zinc-800 sm:bg-transparent flex-col items-center justify-center space-y-10 pb-10 sm:py-10">
                <div className="bg-white dark:bg-zinc-800 rounded-sm sm:shadow-sm p-10 mx-10 max-w-full w-[416px]">
                    <Logo className="mb-10"/>

                    {children}
                </div>

                {footer}
            </div>
    )
}
