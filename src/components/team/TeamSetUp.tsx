import {useAuthContext} from "../../contexts/AuthContext";
import {twMerge} from "../../helpers/TwMerge";
import SectionContainer from "../sections/SectionContainer";
import PageTitle from "../sections/PageTitle";
import {useTriggersState} from "../../storage/Triggers";
import {useUserUsageState} from "../../storage/UserUsage";
import {TrackingCodeIntegrationHelper} from "./TrackingCodeIntegrationHelper";
import LoadingPage from "../../pages/LoadingPage";
import {useEffect} from "react";
import {TWO_SECONDS} from "../../helpers/ExpirableLocalStorage";

type Props = {
    onFinished?: () => void
}

export function TeamSetUp({onFinished}: Props) {
    const context = useAuthContext()
    const currentTeam = context.userState.currentTeam(context.teamState.currentTeamId)
    const {triggers} = useTriggersState()
    const {userUsage} = useUserUsageState()

    useEffect(() => {
        if (onFinished !== undefined && currentTeam?.initiated) onFinished()
    }, [currentTeam]);

    useEffect(() => {
        const interval = setInterval(() => context.userState.refreshUser(true), TWO_SECONDS * 1000)
        return () => clearInterval(interval)
    }, [])

    if (triggers.length === 0) {
        return <LoadingPage/>
    }

    return (<SectionContainer>
        <div className="-mx-2.5 pb-64 grid gap-4 grid-cols-1 md:grid-cols-2 ">
            <div
                className={twMerge("relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow col-span-2")}
            >

                <PageTitle
                    title="Integrate your tracking code"
                    description="Add the tracking code to your site to strat collecting data."
                    titleClassName={"text-base"}
                />

                <TrackingCodeIntegrationHelper
                    trigger={triggers[0]}
                    usage={userUsage.usage}
                />
            </div>
        </div>
    </SectionContainer>)
}
