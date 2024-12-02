import { useTriggersState } from "../storage/Triggers";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import { useUserUsageState } from "../storage/UserUsage";
import { FIVE_MINUTES_SECONDS, FIVE_SECONDS, TWO_SECONDS } from "../helpers/ExpirableLocalStorage";
import EventTracker from "../helpers/EventTracker";
import { useAuthContext } from "../contexts/AuthContext";
import { WelcomeDomainStep } from "./WelcomeDomainStep";
import { AddCodeStep } from "./WelcomeAddCodeStep";
import { ChoosePlanStep } from "./WelcomeChoosePlanStep";

type Step = "loading" | "domain" | "add-code" | "choose-plan";

export function Welcome() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const context = useAuthContext();
    const user = context.userState.user;
    const currentTeam = context.userState.currentTeam(context.teamState.currentTeamId);
    const { triggers } = useTriggersState();
    const { userUsage, loadedUsage, loadUsage } = useUserUsageState();
    const [step, setStep] = useState<Step>("loading");
    const [allowFinish, setAllowFinish] = useState(false);
    const [allowSkip, setAllowSkip] = useState(false);

    useEffect(() => {
        if (userUsage.usage > 0) setAllowFinish(true);
    }, [userUsage]);

    useEffect(() => {
        if (!loadedUsage) return;

        if (userUsage.usage > 0 && searchParams.get("force") !== "true") {
            navigate("/");
            return;
        }

        fetchAuthApi("/users/defaults", {
            method: "POST",
            success: (data) => {
                context.userState.refreshUser(true);
                context.teamState.loadTeams(true);
                setStep("domain");
            },
            error: (error) => null,
            catcher: (e) => null,
        });
    }, [loadedUsage]);

    useEffect(() => {
        if (context.userState.user === null) {
            return;
        }

        context.teamState.setCurrentTeamFromTeams(context.userState.user, context.userState.user?.all_teams);
    }, [context.userState.user]);

    useEffect(() => {
        const trigger = triggers[0];
        if (trigger !== undefined) {
            if (step === "loading") {
                setStep(currentTeam?.domain !== "my-team.dev" ? "add-code" : "domain");
            }
        }
    }, [triggers, step]);

    useEffect(() => {
        if (allowFinish) {
            return;
        }

        const interval = setInterval(loadUsage, TWO_SECONDS * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setTimeout(() => setAllowSkip(true), FIVE_SECONDS * 1000);
        setTimeout(() => setAllowFinish(true), FIVE_MINUTES_SECONDS * 1000);
    }, []);

    const handleFinishCodeStep = () => {
        EventTracker.track("675c40d3-d5c8-44df-bcb5-7882d1959e45", { step: "CodeStep", user_id: user?.email });
        const referrer = localStorage.getItem("metricswave:referrer") ?? document.referrer;
        EventTracker.track("f3fcf7cc-416d-4ff9-bc12-3878e9127ff7", {
            email: user?.email,
            user_id: user?.email,
            referrer,
            step: 2,
        });

        setStep("choose-plan");
    };

    const finishChoosePlanStep = () => {
        EventTracker.track("675c40d3-d5c8-44df-bcb5-7882d1959e45", { step: "ChoosePlanStep", user_id: user?.email });
        const referrer = localStorage.getItem("metricswave:referrer") ?? document.referrer;
        EventTracker.track("f3fcf7cc-416d-4ff9-bc12-3878e9127ff7", {
            email: user?.email,
            user_id: user?.email,
            referrer,
            step: 3,
        });

        navigate("/");
    };

    if (step === "loading") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-pulse">
                <CircleArrowsIcon className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    if (step === "domain") {
        return (
            <WelcomeDomainStep
                onFinish={() => {
                    context.userState.refreshUser(true);
                    setStep("add-code");
                }}
            />
        );
    }

    if (step === "add-code") {
        return (
            <AddCodeStep
                triggers={triggers}
                userUsage={userUsage}
                allowFinish={allowFinish}
                handleFinishCodeStep={handleFinishCodeStep}
                allowSkip={allowSkip}
            />
        );
    }

    return <ChoosePlanStep handleFinish={finishChoosePlanStep} />;
}
