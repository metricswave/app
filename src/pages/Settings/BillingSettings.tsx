import format from "date-fns/format"
import {useState} from "react"
import {addMonths, startOfMonth} from "date-fns"
import {useUserState} from "../../storage/User"
import {number_formatter} from "../../helpers/NumberFormatter"
import {NoLinkButton} from "../../components/buttons/LinkButton"
import {portalCheckout} from "../../helpers/PortalCheckout"
import {useUserUsageState} from "../../storage/UserUsage"
import {useAvailablePricesState} from "../../storage/AvailablePrices"
import {price_formatter} from "../../helpers/PriceFormatter"

export default function BillingSettings() {
    const {user} = useUserState(true)
    const [portalLoading, setPortalLoading] = useState(false)
    const [loadingPurchase, setLoadingPurchase] = useState(false)
    const {availablePrices, loaded, purchase} = useAvailablePricesState()
    const {userUsage} = useUserUsageState()
    const [usageLimit] = useState(user!.subscription_type === "free" ? 1000 : 75000)

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
                        width: `${(userUsage.usage / usageLimit) * 100}%`,
                    }}></div>
                </div>

                <div className="flex flex-col text-sm mt-4 space-y-2 opacity-70">
                    <span>{number_formatter(userUsage.usage)} / {number_formatter(usageLimit)} events sent.</span>
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <h2 className="font-bold">Current Plan</h2>
                <div>
                    {user?.subscription_type === "free" && (
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col space-y-3 bg-blue-100/25 dark:bg-blue-900/10 border border-blue-500/50 dark:border-blue-700 rounded-sm p-4 w-full">
                                <div className="font-bold text-zinc-800 dark:text-zinc-100">Free Plan</div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span>500 events per month</span>
                                    <span className="hidden sm:inline">/</span>
                                    <span>Unlimited event types</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {user?.subscription_type === "lifetime" && (
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col space-y-3 bg-blue-100/25 dark:bg-blue-900/10 border border-blue-500/50 dark:border-blue-700 rounded-sm p-4 w-full">
                                <div className="font-bold text-zinc-800 dark:text-zinc-100">Lifetime Licence</div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span>{number_formatter(75000)} events per month</span>
                                    <span className="hidden sm:inline">/</span>
                                    <span>Unlimited event types</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {user?.subscription_type === "monthly" && (
                        <div className="flex flex-row space-x-4" onClick={() => {
                            setPortalLoading(true)
                            portalCheckout("/settings/billing")
                        }}>
                            <div className="flex flex-col space-y-3 bg-blue-100/25 dark:bg-blue-900/10 border border-blue-500/50 dark:border-blue-700 rounded-sm p-4 w-full">
                                <div className="font-bold text-zinc-800 dark:text-zinc-100">Monthly Subscription</div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span>{number_formatter(75000)} events per month</span>
                                    <span className="hidden sm:inline">/</span>
                                    <span>Unlimited events types</span>
                                </div>
                                <NoLinkButton loading={portalLoading}
                                              className="text-blue-500"
                                              text="Manage your subscription →"/>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {user?.subscription_type === "free" && (
                <div className="flex flex-col space-y-4">
                    <div>
                        <h3 className="font-bold mb-2">Upgrade Plan</h3>
                        <p className="opacity-70 text-sm">Upgrade your account to get more events per month.</p>
                    </div>

                    <div>
                        <div className="flex flex-col space-y-4">

                            {loaded && <>

                                <div
                                    onClick={() => {
                                        if (loadingPurchase) return
                                        setLoadingPurchase(true)
                                        purchase(availablePrices.monthly.id)
                                    }}
                                    className={[
                                        "flex flex-col space-y-3 bg-zinc-100/25 dark:bg-blue-900/5 border border-blue-200/50 dark:border-blue-900/50 rounded-sm p-4 w-full hover:border-blue-500/70 hover:dark:border-blue-700 hover:bg-blue-100/70 dark:hover:bg-blue-900/20 smooth",
                                        loadingPurchase ? "animate-pulse cursor-not-allowed" : "cursor-pointer",
                                    ].join(" ")}>
                                    <div className="font-bold text-blue-500">
                                        Monthly Subscription &mdash; {price_formatter(availablePrices.monthly.price)}/mo
                                    </div>
                                    <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                        <span>Paid monthly, cancel at any time.</span>
                                        <span className="hidden sm:inline">/</span>
                                        <span>{number_formatter(75000)} events per month</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => {
                                        if (loadingPurchase) return
                                        setLoadingPurchase(true)
                                        purchase(availablePrices.lifetime.id)
                                    }}
                                    className={[
                                        "flex flex-col space-y-3 bg-zinc-100/25 dark:bg-blue-900/5 border border-blue-200/50 dark:border-blue-900/50 rounded-sm p-4 w-full hover:border-blue-500/70 hover:dark:border-blue-700 hover:bg-blue-100/70 dark:hover:bg-blue-900/20 smooth",
                                        loadingPurchase ? "animate-pulse cursor-not-allowed" : "cursor-pointer",
                                    ].join(" ")}>
                                    <div className="font-bold text-blue-500">
                                        Lifetime License &mdash; {price_formatter(availablePrices.lifetime.price)}
                                    </div>
                                    <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                        <span>One payment only.</span>
                                        <span className="hidden sm:inline">/</span>
                                        <span>{number_formatter(75000)} events per month</span>
                                    </div>
                                </div>

                            </>}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
