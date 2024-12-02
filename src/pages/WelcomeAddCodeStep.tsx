import PrimaryButton from "../components/form/PrimaryButton";
import SecondaryButton from "../components/form/SecondaryButton";
import Logo from "../components/logo/Logo";
import { TrackingCodeIntegrationHelper } from "../components/team/TrackingCodeIntegrationHelper";

export function AddCodeStep({
    triggers,
    userUsage,
    allowFinish,
    handleFinishCodeStep,
    allowSkip,
}: {
    triggers: import("/Users/victor.falcon/Projects/metricswave/app/src/types/Trigger").Trigger[];
    userUsage: { usage: number };
    allowFinish: boolean;
    handleFinishCodeStep: () => void;
    allowSkip: boolean;
}) {
    return (
        <div className="max-w-[600px] px-4 py-12 mx-auto flex flex-col space-y-14">
            <Logo />

            <div className="flex flex-col space-y-4">
                <h2 className="text-xl sm:text-2xl">Set-up your tracking script.</h2>

                <p className="sm:text-lg pt-3">One last step to start tracking your metrics.</p>

                <p className="sm:text-lg">
                    Integrate the tracking code on your site. There are different guides for each platform:
                </p>

                {triggers[0] !== undefined && (
                    <TrackingCodeIntegrationHelper trigger={triggers[0]} usage={userUsage.usage} />
                )}
            </div>

            <div>
                <PrimaryButton
                    onClick={() => {
                        if (!allowFinish) {
                            return;
                        }

                        handleFinishCodeStep();
                    }}
                    className={[
                        "w-full",
                        !allowFinish
                            ? "bg-zinc-500/20 text-zinc-400 border-zinc-300 hover:bg-zinc-500/20 hover:text-zinc-600 hover:border-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-600 dark:border-zinc-700 hover:dark:bg-zinc-500/20 hover:dark:text-zinc-600 hover:dark:border-zinc-700 cursor-not-allowed"
                            : "",
                    ].join(" ")}
                    text="Done →"
                />

                <SecondaryButton
                    className={[
                        "w-full mt-4 border-transparent shadow-none transition-all duration-300 text-sm",
                        !allowSkip ? "opacity-0 cursor-default" : "",
                    ].join(" ")}
                    onClick={() => {
                        handleFinishCodeStep();
                    }}
                    text={"Skip for now"}
                />
            </div>
        </div>
    );
}
