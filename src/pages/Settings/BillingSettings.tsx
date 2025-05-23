import format from "date-fns/format";
import { useEffect, useState } from "react";
import { addMonths, startOfMonth } from "date-fns";
import { number_formatter } from "../../helpers/NumberFormatter";
import { useUserUsageState } from "../../storage/UserUsage";
import { useAvailablePricesState } from "../../storage/AvailablePrices";
import LoadingPage from "../LoadingPage";
import eventTracker from "../../helpers/EventTracker";
import { useLocation } from "react-router-dom";
import { portalCheckout } from "../../helpers/PortalCheckout";
import { NoLinkButton } from "../../components/buttons/LinkButton";
import { useAuthContext } from "../../contexts/AuthContext";
import SectionContainer from "../../components/sections/SectionContainer";
import { twMerge } from "../../helpers/TwMerge";
import { PlanBox } from "../../components/plans/plan";

export default function BillingSettings() {
    const queryParams = new URLSearchParams(useLocation().search);
    const { userState, teamState } = useAuthContext();
    const { user, refreshUser, currentTeam } = userState;
    const [portalLoading, setPortalLoading] = useState(false);
    const [loadingPurchase, setLoadingPurchase] = useState(false);
    const { availablePrices, loaded, purchase } = useAvailablePricesState();
    const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
    const { userUsage } = useUserUsageState();
    const team = currentTeam(teamState.currentTeamId!)!;
    const subscriptionType = team?.subscription_type ?? "free";
    const subscribedPlan =
        team?.subscription_plan_id && availablePrices.length > 1
            ? availablePrices.find((p) => p.id === team.subscription_plan_id)!
            : availablePrices.find((p) => p.id === 1)!;

    const availablePricesRecomended = availablePrices.filter(
        (p) => p.eventsLimit === null || p.eventsLimit > userUsage.usage,
    );

    useEffect(refreshUser, []);

    useEffect(() => {
        if (queryParams.get("fromBillingPortal") === "true" && queryParams.get("success") === "true") {
            const currency = queryParams.get("currency");
            const value = parseInt(queryParams.get("amount") ?? "0") / 100;
            eventTracker.pixelEvent("Purchase", { value, currency });
            eventTracker.track("edbecea2-9097-49bb-95ac-70eec9578960", { step: "Upgraded", user_id: user?.email });
        }
    }, []);

    useEffect(() => {
        if (queryParams.get("fromBillingPortal") !== "true") {
            eventTracker.track("edbecea2-9097-49bb-95ac-70eec9578960", { step: "Go To Billing", user_id: user?.email });
        }
    }, []);

    if (!loaded) {
        return <LoadingPage />;
    }

    return (
        <SectionContainer size={"big"} align={"left"}>
            <div className="flex flex-col space-y-14">
                <h1 className="font-bold">Billing</h1>

                <div className="flex flex-col space-y-4">
                    <div>
                        <h3 className="font-bold mb-2">Current usage</h3>
                        <p className="opacity-70 text-sm">
                            Remaining until {format(startOfMonth(addMonths(new Date(), 1)), "PPP")}.
                        </p>
                    </div>

                    <div className={twMerge("rounded-sm bg-blue-100 dark:bg-zinc-500/20 h-8 w-full")}>
                        <div
                            className={twMerge("rounded-sm bg-blue-500 h-8 max-w-full w-10 shadow transition-all", {
                                "bg-red-500 dark:bg-red-500/80 animate-pulse":
                                    userUsage.usage > (subscribedPlan.eventsLimit ?? 9999999),
                            })}
                            style={{
                                width: `${Math.min(
                                    100,
                                    (userUsage.usage / (subscribedPlan.eventsLimit ?? 9999999)) * 100,
                                )}%`,
                            }}
                        ></div>
                    </div>

                    <div
                        className={twMerge("flex flex-col text-sm mt-4 space-y-2 opacity-70", {
                            "text-red-500 dark:text-red-500/80 animate-pulse":
                                userUsage.usage > (subscribedPlan.eventsLimit ?? 9999999),
                        })}
                    >
                        <span>
                            {number_formatter(userUsage.usage)} /{" "}
                            {subscribedPlan.eventsLimit === null
                                ? "Unlimited"
                                : number_formatter(subscribedPlan.eventsLimit)}{" "}
                            events sent.
                        </span>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <h2 className="font-bold">Current Plan</h2>
                    <div>
                        {subscriptionType === "free" && (
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col space-y-3 bg-blue-100/25 dark:bg-blue-900/10 border border-blue-500/50 dark:border-blue-700 rounded-sm p-4 w-full">
                                    <div className="font-bold text-zinc-800 dark:text-zinc-100">Free Plan</div>
                                    <div className="text-sm opacity-70 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                        <span>{number_formatter(1000)} events per month</span>
                                        <span className="hidden sm:inline">/</span>
                                        <span>Unlimited data retention</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {subscriptionType === "lifetime" && (
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

                        {subscriptionType === "monthly" && (
                            <div
                                className="flex flex-row space-x-4"
                                onClick={() => {
                                    setPortalLoading(true);
                                    portalCheckout(team.id, "/settings/billing");
                                }}
                            >
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
                                    <NoLinkButton
                                        loading={portalLoading}
                                        className="text-blue-500"
                                        text="Manage your subscription →"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {subscriptionType === "free" && (
                    <div className="flex flex-col space-y-4">
                        <div>
                            <h3 className="font-bold mb-2">Upgrade Plan</h3>
                            <p className="opacity-70 text-sm">Upgrade your account to get more events per month.</p>
                        </div>

                        <div>
                            <div className="flex flex-col space-y-4">
                                <div className="pt-2 mb-4">
                                    <div
                                        className="w-auto text-sm text-blue-500 border-blue-500 dark:hover:border-blue-200 dark:hover:text-blue-200 hover:text-blue-700 hover:border-blue-700 smooth-all cursor-pointer border-b border-dotted inline-block"
                                        onClick={() => {
                                            setPeriod(period === "monthly" ? "yearly" : "monthly");
                                        }}
                                    >
                                        Switch to {period === "monthly" ? "yearly" : "monthly"} prices.
                                    </div>
                                </div>

                                {loaded && (
                                    <>
                                        {availablePricesRecomended.map((plan) => {
                                            if (plan.id === 1) {
                                                return null;
                                            }

                                            return (
                                                <PlanBox
                                                    plan={plan}
                                                    loadingPurchase={loadingPurchase}
                                                    setLoadingPurchase={setLoadingPurchase}
                                                    period={period}
                                                    purchase={purchase}
                                                    team={team}
                                                    user={user}
                                                />
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SectionContainer>
    );
}
