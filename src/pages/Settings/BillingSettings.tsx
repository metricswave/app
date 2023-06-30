import format from "date-fns/format"
import {useState} from "react"
import {addMonths, startOfMonth} from "date-fns"
import {useUserState} from "../../storage/User"
import {number_formatter} from "../../helpers/NumberFormatter"
import {NoLinkButton} from "../../components/buttons/LinkButton"
import {portalCheckout} from "../../helpers/PortalCheckout"
import {useUserUsageState} from "../../storage/UserUsage"
import {planPrice, useAvailablePricesState} from "../../storage/AvailablePrices"
import {price_formatter} from "../../helpers/PriceFormatter"

export default function BillingSettings() {
    const {user} = useUserState(true)
    const [portalLoading, setPortalLoading] = useState(false)
    const [loadingPurchase, setLoadingPurchase] = useState(false)
    const {availablePrices, loaded, purchase} = useAvailablePricesState()
    const [period, setPeriod] = useState<"monthly" | "yearly">("yearly")
    const {userUsage} = useUserUsageState()
    const subscribedPlan = user?.subscription_plan_id ?
        availablePrices.find(p => p.id === user.subscription_plan_id)! :
        availablePrices.find(p => p.id === 1)!

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
                        width: `${(userUsage.usage / (subscribedPlan.eventsLimit ?? 9999999)) * 100}%`,
                    }}></div>
                </div>

                <div className="flex flex-col text-sm mt-4 space-y-2 opacity-70">
                    <span>{number_formatter(userUsage.usage)} / {subscribedPlan.eventsLimit === null ? "Unlimited" : number_formatter(subscribedPlan.eventsLimit)} events sent.</span>
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
                                    <span>1000 events per month</span>
                                    <span className="hidden sm:inline">/</span>
                                    <span>Unlimited event types</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {user?.subscription_type === "lifetime" && (
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col space-y-3 bg-blue-100/25 dark:bg-blue-900/10 border border-blue-500/50 dark:border-blue-700 rounded-sm p-4 w-full">
                                <div className="font-bold text-zinc-800 dark:text-zinc-100">
                                    {subscribedPlan.name} Plan &mdash; Lifetime Licence
                                </div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    {subscribedPlan.eventsLimit === null ? (
                                        <span>Unlimited events per month</span>
                                    ) : (
                                        <span>{number_formatter(subscribedPlan.eventsLimit)} events per month</span>
                                    )}
                                    <span className="hidden sm:inline">/</span>
                                    {subscribedPlan.dataRetentionInMonths === null ? (
                                        <span>Unlimited data retention</span>
                                    ) : (
                                        <span>{subscribedPlan.dataRetentionInMonths} months of data retention</span>
                                    )}
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
                                <div className="font-bold text-zinc-800 dark:text-zinc-100">
                                    {subscribedPlan.name} Plan
                                </div>
                                <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    {subscribedPlan.eventsLimit === null ? (
                                        <span>Unlimited events per month</span>
                                    ) : (
                                        <span>{number_formatter(subscribedPlan.eventsLimit)} events per month</span>
                                    )}
                                    <span className="hidden sm:inline">/</span>
                                    {subscribedPlan.dataRetentionInMonths === null ? (
                                        <span>Unlimited data retention</span>
                                    ) : (
                                        <span>{subscribedPlan.dataRetentionInMonths} months of data retention</span>
                                    )}
                                </div>
                                <NoLinkButton loading={portalLoading}
                                              className="text-blue-500"
                                              text="Manage your subscription →"/>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {(user?.subscription_type === "free") && (
                <div className="flex flex-col space-y-4">
                    <div>
                        <h3 className="font-bold mb-2">Upgrade Plan</h3>
                        <p className="opacity-70 text-sm">Upgrade your account to get more events per month.</p>
                    </div>

                    <div>
                        <div className="flex flex-col space-y-4">

                            <div className="pt-2 -mb-4">
                                <div
                                    className="w-auto text-sm text-blue-500 border-blue-500 dark:hover:border-blue-200 dark:hover:text-blue-200 hover:text-blue-700 hover:border-blue-700 smooth-all cursor-pointer border-b border-dotted inline-block"
                                    onClick={() => {
                                        setPeriod(period === "monthly" ? "yearly" : "monthly")
                                    }}
                                >
                                    Switch to {period === "monthly" ? "yearly" : "monthly"} prices.
                                </div>
                            </div>

                            {loaded && <>

                                {availablePrices.map(plan => {
                                        if (plan.id === 1) {
                                            return (<div key={plan.id}></div>)
                                        }

                                        return (<div
                                                key={plan.id}
                                                onClick={() => {
                                                    if (loadingPurchase) return
                                                    setLoadingPurchase(true)

                                                    if (planPrice(plan, period) === null) {
                                                        window.location.href = "mailto:sales@metricswave.com"
                                                        setLoadingPurchase(false)
                                                    } else {
                                                        purchase(plan.id, period)
                                                    }
                                                }}
                                                className={[
                                                    "flex flex-col space-y-3 border  rounded-sm p-4 w-full smooth",
                                                    loadingPurchase ? "animate-pulse cursor-not-allowed" : "",
                                                    "bg-zinc-100/25 dark:bg-blue-900/5 border-blue-200/50 dark:border-blue-900/50 hover:border-blue-500/70 hover:dark:border-blue-700 hover:bg-blue-100/70 dark:hover:bg-blue-900/20 cursor-pointer",
                                                ].join(" ")}>
                                                <div className="font-bold text-blue-500">
                                                    {plan.name} Plan &mdash; {planPrice(plan, period) === null ? "Contact Us" : price_formatter(planPrice(plan, period)) + "/" + (period === "monthly" ? "mo" : "y")}
                                                    {period === "yearly" && plan.name === "Business" &&
                                                        <span className="ml-2 text-sm">(2 months free)</span>}
                                                </div>
                                                <div className="text-sm opacity-70 flex flex-col gap-2">
                                                    {planPrice(plan, period) > 0 &&
                                                        <span>Paid monthly, cancel at any time.</span>}
                                                    <span>{plan.eventsLimit === null ? "Unlimited" : number_formatter(plan.eventsLimit)} events per month</span>
                                                    <span>{plan.dataRetentionInMonths === null ? "Unlimited" : number_formatter(plan.dataRetentionInMonths)} months of data retention</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                )}

                            </>}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

