import { Plan, planPrice } from "../../storage/AvailablePrices";
import { Team } from "../../types/Team";
import { User } from "../../types/User";
import eventTracker from "../../helpers/EventTracker";
import { number_formatter } from "../../helpers/NumberFormatter";
import { price_formatter } from "../../helpers/PriceFormatter";
import { BasicPeriod } from "../../types/Period";

type Props = {
    plan: Plan;
    loadingPurchase: boolean;
    setLoadingPurchase: (loading: boolean) => void;
    period: BasicPeriod;
    purchase: PurchaseFunction;
    team: Team;
    user: User | null;
};

type PurchaseFunction = (teamId: number, planId: number, period: string, email?: string | undefined) => void;

export function PlanBox({ plan, loadingPurchase, setLoadingPurchase, period, purchase, team, user }: Props) {
    const price = planPrice(plan, period);

    return (
        <div
            key={plan.id}
            onClick={() => {
                if (loadingPurchase) return;
                setLoadingPurchase(true);

                if (price === null) {
                    window.location.href = "mailto:sales@metricswave.com";
                    setLoadingPurchase(false);
                } else {
                    purchase(team.id, plan.id, period, user?.email);
                    eventTracker.pixelEvent("InitiateCheckout");
                }
            }}
            className={[
                "flex flex-col space-y-3 border  rounded-sm p-4 w-full smooth",
                loadingPurchase ? "animate-pulse cursor-not-allowed" : "",
                "bg-zinc-100/25 dark:bg-blue-900/5 border-blue-200/50 dark:border-blue-900/50 hover:border-blue-500/70 hover:dark:border-blue-700 hover:bg-blue-100/70 dark:hover:bg-blue-900/20 cursor-pointer",
            ].join(" ")}
        >
            <div className="font-bold text-blue-500">
                {plan.name} Plan &mdash; {price === null ? "Contact Us" : price_formatter(price) + "/month"}
                {period === "yearly" &&
                    (plan.name === "Business" || plan.name === "Starter" || plan.name === "Corporate") && (
                        <span className="ml-2 text-sm">(2 months free)</span>
                    )}
            </div>
            <div className="text-sm opacity-70 flex flex-col gap-2">
                {period === "yearly" && <span>Billed yearly &mdash; {price_formatter(plan.yearlyPrice)}</span>}
                {price > 0 && <span>Cancel at any time</span>}
                <span>
                    {plan.eventsLimit === null ? "Unlimited" : number_formatter(plan.eventsLimit)} events per month
                </span>
                <span>Unlimited data retention</span>
            </div>
        </div>
    );
}
