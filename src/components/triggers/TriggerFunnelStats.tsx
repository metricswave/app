import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {useEffect, useState} from "react"
import {calculateDefaultDateForPeriod, Period} from "../../types/Period"
import {TriggerStatsLoading} from "./TriggerStatsLoading"
import {ParamStatRow, useTriggerParamsStatsState} from "../../storage/TriggerParamsStats"
import {ResponsiveFunnel} from "@nivo/funnel"
import {FunnelDatum} from "@nivo/funnel/dist/types/types"
import {percentage_of} from "../../helpers/PercentageOf"

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
            backgroundColor: "var(--backgroud-color-funnel-tooltip)",
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
        defaultParameter,
        defaultDate,
        publicDashboard,
        defaultPeriod = "day",
        hideFilters = false,
        compareWithPrevious = false,
        height = "400",
    }: Props,
) {
    const parameter = "step"
    const [description, setDescription] = useState<string>(
        "The funnel shows the number of hits for each step of the funnel.",
    )

    const {stats, previousStats, loadStats, loadPreviousStats, statsLoading} = useTriggerParamsStatsState()

    const [hasStats, setHasStats] = useState<boolean>(false)
    const [data, setData] = useState<FunnelDatum[]>([])
    const [period, setPeriod] = useState<Period>(defaultPeriod)
    const [date, setDate] = useState<string>(defaultDate ?? calculateDefaultDateForPeriod(period))
    const [fieldDate, setFieldDate] = useState<string>()

    // const dateFieldType = fieldTypeForPeriod(period)
    // const setPeriodAndDate = (period: Period) => {
    //     const date = calculateDefaultDateForPeriod(period)
    //     setDate(date)
    //     setFieldDate(
    //         fieldTypeForPeriod(period) === "month" ? date.slice(0, 7) : date,
    //     )
    //     setPeriod(period)
    // }

    useEffect(() => {
        const hasStats = stats !== undefined && stats.plot !== undefined && stats.plot[parameter] !== undefined
        setHasStats(hasStats)
    }, [stats])

    useEffect(() => {
        if (hasStats === false) {
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
        const percentageOfUserThatReachedLastStep = percentage_of(
            newData[0].value,
            newData[newData.length - 1].value,
        )

        setData(newData)
        setDescription(`${percentageOfUserThatReachedLastStep}% of users reached the last step of the funnel.`)
    }, [hasStats])

    // const previousParamStats: ParamStatRow[] | undefined = previousStats !== undefined && previousStats.plot !== undefined && previousStats.plot[parameter] !== undefined ?
    //     Object.values(previousStats.plot[parameter]) :
    //     undefined
    // const totalScore = paramStats.reduce((acc, curr) => acc + curr.score, 0)
    // const totalScoreString = number_formatter(totalScore)

    // useEffect(() => {
    //     setDate(fieldTypeForPeriod(period) === "month" ? fieldDate + "-01" : fieldDate!)
    // }, [fieldDate])
    // useEffect(() => setPeriodAndDate(defaultPeriod), [defaultPeriod])
    // useEffect(() => setDate(defaultDate!), [defaultDate])

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
                    description={description}
                />
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
        </div>
    )
}
