import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {useEffect, useState} from "react"
import {calculateDefaultDateForPeriod, fieldTypeForPeriod, Period} from "../../types/Period"
import {TriggerStatsLoading} from "./TriggerStatsLoading"
import {ParamStatRow, useTriggerParamsStatsState} from "../../storage/TriggerParamsStats"
import {ResponsiveFunnel} from "@nivo/funnel"
import {FunnelDatum} from "@nivo/funnel/dist/types/types"
import {percentage_diff, percentage_of} from "../../helpers/PercentageOf"
import InputFieldBox from "../form/InputFieldBox"
import {ArrowDownIcon, ArrowUpIcon} from "@radix-ui/react-icons"
import {number_formatter} from "../../helpers/NumberFormatter"

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

        const paramStats: ParamStatRow[] = hasStats ? Object.values(stats!.plot[parameter]) : []
        const newData = trigger.configuration.steps!.map((paramKey) => {
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

        if (isNaN(percentageOfUserThatReachedLastStep) || isNaN(previousPercentageOfUserThatReachedLastStep)) {
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
                    borderWidth={4}
                    currentBorderWidth={8}
                    fillOpacity={0.5}
                    borderOpacity={1}
                    motionConfig="wobbly"
                />
            </div>

            <div className="pt-3 pb-2">
                <ul className="flex flex-row justify-evenly text-center">
                    {data.map((d) => {
                        const previousStats = previousData.find((pd) => pd.id === d.id)?.value ?? 0
                        const percentageDifference = percentage_diff(d.value, previousStats)

                        return (
                            <li key={d.id} className="flex-1 flex flex-col gap-2 text-sm sm:text-xs">
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <span className="opacity-70">{d.label}</span>
                                    <span>{d.value}</span>
                                </div>

                                {compareWithPrevious && <div
                                    className="cursor-help flex flex-row gap-1 items-center justify-center"
                                    title={`Previous period: ${previousStats} hits`}
                                >
                                    {percentageDifference !== Infinity && <>
                                        {percentageDifference > 0 ?
                                            <ArrowUpIcon className="h-4 text-green-500"/> :
                                            <ArrowDownIcon className="h-4 text-red-500"/>
                                        }
                                    </>}

                                    {
                                        percentageDifference === Infinity ?
                                            <span className="text-xs opacity-50">No Previous Data</span> :
                                            <span>{number_formatter(percentageDifference)}%</span>
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
