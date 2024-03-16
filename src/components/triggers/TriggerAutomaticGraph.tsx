import {Trigger} from "../../types/Trigger"
import {TriggerStats} from "./TriggerStats"
import SectionContainer from "../sections/SectionContainer"
import {TriggerParamsStats} from "./TriggerParamsStats"
import {TriggerFunnelStats} from "./TriggerFunnelStats"
import {useState} from "react";
import {calculateDefaultDateForPeriod, DEFAULT_PERIOD, Period, periods} from "../../types/Period";
import {PeriodChooser} from "../dashboard/PeriodChooser";

export default function TriggerAutomaticGraph({trigger}: { trigger: Trigger }) {
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [compareWithPrevious, setCompareWithPrevious] = useState<boolean>(false)
    const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD)
    const setPeriodAndDate = (period: Period) => {
        setDate(calculateDefaultDateForPeriod(period))
        setPeriod(period)
    }
    const periodConfiguration = periods.find(p => p.value === period)!
    const hasParams = trigger.configuration.fields["parameters"] !== undefined
        && trigger.configuration.fields["parameters"].length > 0

    if (trigger.configuration.type === "funnel") {
        return (<>
            <SectionContainer size="big">
                <PeriodChooser
                    activePeriodValue={period}
                    setPeriodAndDate={setPeriodAndDate}
                    compareWithPrevious={compareWithPrevious}
                    setCompareWithPrevious={setCompareWithPrevious}
                />

                <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                    <TriggerFunnelStats
                        title={"Funnel"}
                        trigger={trigger}
                        defaultPeriod={periodConfiguration.period}
                        defaultDate={date}
                        hideFilters
                        compareWithPrevious={compareWithPrevious}
                    />
                </div>
            </SectionContainer>
        </>)
    }

    return (<>
        <SectionContainer size="big">
            <PeriodChooser
                activePeriodValue={period}
                setPeriodAndDate={setPeriodAndDate}
                compareWithPrevious={compareWithPrevious}
                setCompareWithPrevious={setCompareWithPrevious}
            />
        </SectionContainer>

        <SectionContainer size="big">
            <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                <TriggerStats
                    trigger={trigger}
                    title={"Hits"}
                    defaultPeriod={periodConfiguration.period}
                    defaultDate={date}
                    hideViewSwitcher
                    compareWithPrevious={compareWithPrevious}
                />
            </div>
        </SectionContainer>

        {hasParams && (
            <SectionContainer size="big">
                <div className="relative group bg-white dark:bg-zinc-800/40 rounded-sm p-5 pb-4 shadow">
                    <TriggerParamsStats
                        trigger={trigger}
                        defaultPeriod={periodConfiguration.period}
                        defaultDate={date}
                        compareWithPrevious={compareWithPrevious}
                        hideFilters
                    />
                </div>
            </SectionContainer>
        )}
    </>)
}
