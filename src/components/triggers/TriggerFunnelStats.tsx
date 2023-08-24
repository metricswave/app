import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {useEffect, useState} from "react"
import {calculateDefaultDateForPeriod, fieldTypeForPeriod, Period} from "../../types/Period"
import {TriggerStatsLoading} from "./TriggerStatsLoading"
import {ParamStatRow, useTriggerParamsStatsState} from "../../storage/TriggerParamsStats"
import {ResponsiveFunnel} from "@nivo/funnel"
import {FunnelDatum} from "@nivo/funnel/dist/types/types"
import {percentage_of} from "../../helpers/PercentageOf"
import InputFieldBox from "../form/InputFieldBox"
import {ArrowDownIcon, ArrowUpIcon} from "@radix-ui/react-icons"
import {number_formatter} from "../../helpers/NumberFormatter"
import {twMerge} from "../../helpers/TwMerge"

const responsiveFunnelTheme = {
    fontFamily: "var(--font-mono)",
    fontSize: 14,
    grid: {
        line: {
            stroke: "var(--color-transparent)",
        },
    },
    tooltip: {
        container: {
            backgroundColor: "var(--background-color-funnel-tooltip)",
            fontSize: 14,
        },
    },
}

type Props = {
    trigger: Trigger
    title?: string
    publicDashboard?: string | undefined
    defaultParameter?: string
    defaultPeriod?: Period
    defaultDate?: string
    hideFilters?: boolean
    compareWithPrevious?: boolean
    height?: string
    size?: "base" | "large"
}

export function TriggerFunnelStats(
    {
        trigger,
        title,
        defaultDate,
        publicDashboard,
        defaultPeriod = "month",
        hideFilters = false,
        compareWithPrevious = false,
        height = "400",
        size = "large",
    }: Props,
) {
    const parameter = "step"
    const [description, setDescription] = useState<string>(
        "The funnel shows the number of hits for each step of the funnel.",
    )
    const [previousDescription, setPreviousDescription] = useState<string | null>(null)

    const {stats, previousStats, loadStats, loadPreviousStats, statsLoading} = useTriggerParamsStatsState()

    const [hasStats, setHasStats] = useState<boolean>(false)
    const [data, setData] = useState<FunnelDatum[]>([])
    const [previousData, setPreviousData] = useState<FunnelDatum[]>([])
    const [period, setPeriod] = useState<Period>(defaultPeriod)
    const [date, setDate] = useState<string>(defaultDate ?? calculateDefaultDateForPeriod(period))
    const [fieldDate, setFieldDate] = useState<string>()

    const dateFieldType = fieldTypeForPeriod(period)
    const setPeriodAndDate = (period: Period) => {
        const date = calculateDefaultDateForPeriod(period)
        setDate(date)
        setFieldDate(
            fieldTypeForPeriod(period) === "month" ? date.slice(0, 7) : date,
        )
        setPeriod(period)
    }

    useEffect(() => {
        const hasStats = stats !== undefined && stats.plot !== undefined && stats.plot[parameter] !== undefined
        setHasStats(hasStats)
    }, [stats])

    // Set data and description
    useEffect(() => {
        if (!hasStats) {
            return
        }

        const paramStats: ParamStatRow[] = hasStats && stats !== undefined ?
            Object.values(stats.plot[parameter]) :
            []
        let newData = trigger.configuration.steps!
            .map((paramKey) => {
                const paramStat = paramStats.find((paramStat) => paramStat.param === paramKey)
                return {
                    id: paramKey,
                    label: paramKey,
                    value: paramStat?.score ?? 0,
                }
            })

        setData(newData)
    }, [stats, hasStats])

    // Set description
    useEffect(() => {
        if (data.length === 0) {
            return
        }

        const percentageOfUserThatReachedLastStep = percentage_of(
            data[0].value,
            data[data.length - 1].value,
        )

        setDescription(`${percentageOfUserThatReachedLastStep}% of users reached the last step of the funnel.`)
    }, [data])

    // Set previous data
    useEffect(() => {
        if (!hasStats) {
            return
        }

        if (!compareWithPrevious) {
            setPreviousDescription(null)
            return
        }

        if (previousStats?.plot === undefined || previousStats.plot[parameter] === undefined) {
            return
        }

        const previousParamStats: ParamStatRow[] = hasStats ? Object.values(previousStats!.plot[parameter]) : []
        const newData = trigger.configuration.steps!.map((paramKey) => {
            const paramStat = previousParamStats.find((paramStat) => paramStat.param === paramKey)
            return {
                id: paramKey,
                label: paramKey,
                value: paramStat?.score ?? 0,
            }
        })

        setPreviousData(newData)
    }, [previousStats, compareWithPrevious, hasStats])

    useEffect(() => {
        if (data.length === 0 || previousData.length === 0) {
            return
        }

        const percentageOfUserThatReachedLastStep = percentage_of(
            data[0].value,
            data[data.length - 1].value,
        )

        const previousPercentageOfUserThatReachedLastStep = percentage_of(
            previousData[0].value,
            previousData[previousData.length - 1].value,
        )

        if (isNaN(percentageOfUserThatReachedLastStep) || isNaN(previousPercentageOfUserThatReachedLastStep) || previousPercentageOfUserThatReachedLastStep === Infinity) {
            return
        }

        setPreviousDescription(
            `${percentageOfUserThatReachedLastStep}% of users reached the last step of the funnel, compared to ${previousPercentageOfUserThatReachedLastStep}% in the previous period.`,
        )
    }, [data, previousStats])

    useEffect(() => setDate(fieldTypeForPeriod(period) === "month" ? fieldDate + "-01" : fieldDate!), [fieldDate])
    useEffect(() => setPeriodAndDate(defaultPeriod), [defaultPeriod])
    useEffect(() => setDate(defaultDate!), [defaultDate])

    // Load stats and compare with previous on changes
    useEffect(
        () => loadStats(trigger, period, date, publicDashboard),
        [trigger.id, period, date, publicDashboard],
    )
    useEffect(
        () => compareWithPrevious === true ? loadPreviousStats(trigger, period, date, publicDashboard) : undefined,
        [trigger.id, compareWithPrevious, period, date, publicDashboard],
    )

    if (statsLoading) {
        return (<TriggerStatsLoading/>)
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="pb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                <PageTitle
                    title={title ?? "Funnel"}
                    description={compareWithPrevious && previousDescription !== null ? previousDescription : description}
                />

                {!hideFilters &&
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
                }
            </div>

            <div style={{height: `${height}px`}}>
                <ResponsiveFunnel
                    data={data}
                    theme={responsiveFunnelTheme}
                    direction="horizontal"
                    spacing={5}
                    valueFormat=" >-.0f"
                    colors={[
                        "var(--color-funnel-1)", "var(--color-funnel-2)", "var(--color-funnel-3)",
                        "var(--color-funnel-4)", "var(--color-funnel-5)", "var(--color-funnel-6)",
                    ]}
                    labelColor={"var(--color-funnel-label)"}
                    beforeSeparatorLength={0}
                    beforeSeparatorOffset={15}
                    afterSeparatorLength={0}
                    afterSeparatorOffset={15}
                    currentPartSizeExtension={10}
                    borderWidth={2}
                    currentBorderWidth={8}
                    fillOpacity={0.5}
                    borderOpacity={1}
                    motionConfig="wobbly"
                />
            </div>

            <div className="pt-3 pb-2">
                <ul className="flex-row justify-evenly hidden sm:flex">
                    {data.map((d: FunnelDatum, index) => {
                        const previousStep = data[index - 1] ?? {value: 0, id: ""}
                        const stepRetention = previousStep.value === 0 ?
                            100 :
                            percentage_of(previousStep.value, d.value)

                        const previousStat = previousData.find((pd) => pd.id === d.id)?.value ?? 0
                        const previousStatPreviousStep = previousStep.id !== "" ?
                            (previousData.find((pd) => pd.id === previousStep.id)?.value ?? 0) :
                            0
                        const previousStatStepRetention = percentage_of(previousStatPreviousStep, previousStat)
                        const retentionDifference = stepRetention - previousStatStepRetention

                        return (
                            <li key={d.id} className="flex-1 flex flex-col gap-2 text-sm sm:text-xs">
                                <div className="opacity-50 font-medium flex flex-row items-center justify-center">
                                    {d.label}
                                </div>
                                <div className={twMerge(
                                    "flex flex-row gap-2 items-center justify-center",
                                )}>
                                    {index === 0 && <>
                                        <div>
                                            <span className="pr-0.5">{d.value}</span>
                                        </div>
                                        <span className="opacity-70 text-xs">hits</span>
                                    </>}
                                    {index !== 0 && previousStep.value !== 0 && <>
                                        <div>
                                            <span className="pr-0.5">{stepRetention}</span>%
                                        </div>
                                        <span className={twMerge(
                                            "opacity-70 text-xs hidden",
                                            {"inline": size === "large"},
                                        )}>from previous step</span>
                                    </>}
                                    {index !== 0 && previousStep.value === 0 && <>
                                        <span className="opacity-70 text-xs">No hits in previous step</span>
                                    </>}
                                </div>

                                {compareWithPrevious && <div
                                    className="cursor-help flex flex-row gap-1 items-center justify-center"
                                    title={`Previous period: ${previousStat} hits`}
                                >
                                    {previousStatStepRetention !== Infinity && <>
                                        {retentionDifference >= 0 ?
                                            <ArrowUpIcon className="h-4 text-green-500"/> :
                                            <ArrowDownIcon className="h-4 text-red-500"/>
                                        }
                                    </>}

                                    {
                                        previousStatStepRetention === Infinity ?
                                            <span className={twMerge("text-xs opacity-50 inline")}>
                                                    {
                                                        size === "large" ?
                                                            "No Previous Data" :
                                                            "No Data"
                                                    }
                                                </span> :
                                            <>
                                                <div>
                                                    <span className="pr-0.5">{number_formatter(retentionDifference)}</span>%
                                                </div>
                                                {size === "large" && <span
                                                    className="opacity-70 cursor-help text-xs border-b border-b-dotted"
                                                    title="Retention difference compared with previous period">
                                                    {size === "large" ? "diff with previous" : "diff"}
                                                </span>}
                                            </>
                                    }
                                </div>}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
