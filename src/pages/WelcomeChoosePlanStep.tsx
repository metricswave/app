import { useEffect, useState } from "react";
import PrimaryButton from "../components/form/PrimaryButton";
import SecondaryButton from "../components/form/SecondaryButton";
import Logo from "../components/logo/Logo";
import { PlanBox } from "../components/plans/plan";
import { useAuthContext } from "../contexts/AuthContext";
import EventTracker from "../helpers/EventTracker";
import { FIVE_SECONDS } from "../helpers/ExpirableLocalStorage";
import { useAvailablePricesState } from "../storage/AvailablePrices";

type Props = {
    handleFinish: () => void;
};

export function ChoosePlanStep({ handleFinish }: Props) {
    const { userState, teamState } = useAuthContext();
    const { user, currentTeam } = userState;
    const team = currentTeam(teamState.currentTeamId!)!;
    const [loadingPurchase, setLoadingPurchase] = useState(false);
    const { availablePrices, loaded, purchase } = useAvailablePricesState();
    const [allowSkip, setAllowSkip] = useState(false);
    const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");

    useEffect(() => {
        setTimeout(() => setAllowSkip(true), FIVE_SECONDS * 1000);
    }, []);

    return (
        <div className="max-w-[600px] px-4 py-12 mx-auto flex flex-col space-y-14">
            <Logo />

            <div className="flex flex-col space-y-4">
                <h2 className="text-xl sm:text-2xl">Choose your plan</h2>
                <p className="sm:text-lg pt-3">
                    Depending on your needs choose the plan that better fits your product.
                </p>
            </div>

            <div className="flex flex-col space-y-3">
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
                        {availablePrices.map((plan) => {
                            if ([1, 5, 6].includes(plan.id)) {
                                return null;
                            }

                            return (
                                <PlanBox
                                    key={`plan_${plan.id}`}
                                    plan={plan}
                                    loadingPurchase={loadingPurchase}
                                    setLoadingPurchase={setLoadingPurchase}
                                    period={period}
                                    purchase={(team, planId, period, email) => {
                                        EventTracker.track("9b2a395f-9344-425b-ba9b-ddd74681c2cf", {
                                            step: "Done",
                                            user_id: user?.email,
                                        });

                                        purchase(team, planId, period, email);
                                    }}
                                    team={team}
                                    user={user}
                                />
                            );
                        })}
                    </>
                )}

                <SecondaryButton
                    className={[
                        "w-full border-transparent shadow-none transition-all duration-300 text-sm",
                        !allowSkip ? "opacity-0 cursor-default" : "",
                    ].join(" ")}
                    onClick={() => {
                        EventTracker.track("9b2a395f-9344-425b-ba9b-ddd74681c2cf", {
                            step: "Done",
                            user_id: user?.email,
                        });

                        handleFinish();
                    }}
                    text={"Continue wihtout plan"}
                />
            </div>
        </div>
    );
}
