import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { money_formatter, number_formatter } from "../../helpers/NumberFormatter";
import { percentage_diff } from "../../helpers/PercentageOf";
import { Period } from "../../types/Period";
import { Trigger } from "../../types/Trigger";
import InputFieldBox from "../form/InputFieldBox";
import PageTitle from "../sections/PageTitle";
import { MainTriggerStats } from "./MainTriggerStats";

type Props = {
    title: string;
    trigger: Trigger;
    publicDashboard?: string | undefined;
    defaultPeriod: Period;
    defaultDate?: string;
    defaultFromDate?: string;
    hideViewSwitcher?: boolean;
    compareWithPrevious?: boolean;
};

export function TriggerNumberStats({
    title,
    trigger,
    publicDashboard,
    defaultPeriod,
    defaultDate,
    defaultFromDate = undefined,
    hideViewSwitcher = false,
    compareWithPrevious = false,
}: Props) {
    return (
        <MainTriggerStats
            title={title}
            trigger={trigger}
            publicDashboard={publicDashboard}
            defaultPeriod={defaultPeriod}
            defaultDate={defaultDate}
            defaultFromDate={defaultFromDate}
            hideViewSwitcher={hideViewSwitcher}
            compareWithPrevious={compareWithPrevious}
            children={(stats, previousPeriodStats, data, fieldDate, setFieldDate, dateFieldType, average) => {
                const totalNumber = (stats.plot ?? []).reduce((acc, { score }) => acc + score, 0);
                const formattedTotalNumber =
                    trigger.configuration.type === "money_income"
                        ? money_formatter(totalNumber)
                        : number_formatter(totalNumber);

                const previousTotalNumber = (previousPeriodStats.plot ?? []).reduce((acc, { score }) => acc + score, 0);
                const formattedPreviousTotalNumber =
                    trigger.configuration.type === "money_income"
                        ? money_formatter(previousTotalNumber)
                        : number_formatter(previousTotalNumber);

                const percentageDifference = percentage_diff(totalNumber, previousTotalNumber);

                return (
                    <>
                        <div className="h-full flex flex-col justify-between">
                            <div className="pb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                                {title !== undefined && (
                                    <PageTitle title={title} description={`${average} average hits in period.`} />
                                )}
                                {!hideViewSwitcher && (
                                    <div className="w-full sm:w-1/3">
                                        <InputFieldBox
                                            setValue={setFieldDate}
                                            label="Date"
                                            type={dateFieldType}
                                            name="date"
                                            placeholder={"Date"}
                                            value={fieldDate as string}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center flex-grow justify-center font-light">
                                <div className="min-h-[220px] my-auto flex flex-col gap-2 items-center justify-center">
                                    <div className="text-5xl lg:text-6xl">{formattedTotalNumber}</div>

                                    {compareWithPrevious && (
                                        <div className="flex items-center gap-2">
                                            {percentageDifference > 0 ? (
                                                <ArrowUpIcon className="h-4 text-green-500" />
                                            ) : (
                                                <ArrowDownIcon className="h-4 text-red-500" />
                                            )}

                                            <div className="text-sm text-gray-400 dark:text-gray-600">
                                                {number_formatter(percentageDifference)}% (
                                                {formattedPreviousTotalNumber})
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                );
            }}
        />
    );
}
