import format from "date-fns/format"
import {useState} from "react"
import {addMonths, startOfMonth} from "date-fns"

export default function BillingSettings() {
    const [usage] = useState(18)
    const [usageLimit] = useState(20)
    const [trigger] = useState(4)
    const [triggerLimit] = useState(5)

    return (
            <div className="flex flex-col space-y-14">
                <h1 className="font-bold">Billing</h1>

                <div className="flex flex-col space-y-4">
                    <div>
                        <h3 className="font-bold mb-2">Current usage</h3>
                        <p className="opacity-70 text-sm">Remaining
                            until {format(startOfMonth(addMonths(new Date(), 1)), "PPP")}.</p>
                    </div>

                    <div className="rounded-sm bg-blue-100 dark:bg-zinc-500/20 h-8 w-full">
                        <div className={["rounded-sm bg-blue-500 h-8 max-w-full w-10 shadow"].join(" ")} style={{
                            width: `${(usage / usageLimit) * 100}%`,
                        }}></div>
                    </div>

                    <div className="flex flex-col text-sm mt-4 space-y-2 opacity-70">
                        <span>{usage} / {usageLimit} notifications</span>
                        <span>{trigger} / {triggerLimit} triggers</span>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <h2 className="font-bold">Current Plan</h2>
                    <div>
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col space-y-3 bg-blue-100/25 dark:bg-blue-900/10 border border-blue-500/50 dark:border-blue-700 rounded-sm p-4 w-full">
                                <div className="font-bold text-zinc-800 dark:text-zinc-100">Free Plan</div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span>20 notifications per month</span>
                                    <span className="hidden sm:inline">/</span>
                                    <span>5 triggers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <div>
                        <h3 className="font-bold mb-2">Upgrade Plan</h3>
                        <p className="opacity-70 text-sm">Upgrade your account to get more notifications and
                            triggers.</p>
                    </div>

                    <div>
                        <div className="flex flex-col space-y-4">

                            <div className="flex flex-col space-y-3 bg-zinc-100/25 dark:bg-blue-900/5 border border-blue-200/50 dark:border-blue-900/50 rounded-sm p-4 w-full hover:border-blue-500/70 hover:dark:border-blue-700 hover:bg-blue-100/70 dark:hover:bg-blue-900/20 smooth cursor-pointer">
                                <div className="font-bold text-blue-500">
                                    Lifetime License &mdash; $29.50
                                </div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span>999 notifications per month</span>
                                    <span className="hidden sm:inline">/</span>
                                    <span>50 triggers</span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3 bg-zinc-100/25 dark:bg-blue-900/5 border border-blue-200/50 dark:border-blue-900/50 rounded-sm p-4 w-full hover:border-blue-500/70 hover:dark:border-blue-700 hover:bg-blue-100/70 dark:hover:bg-blue-900/20 smooth cursor-pointer">
                                <div className="font-bold text-blue-500">
                                    Lifetime License &mdash; $39.50
                                </div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span>999 notifications per month</span>
                                    <span className="hidden sm:inline">/</span>
                                    <span>50 triggers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
