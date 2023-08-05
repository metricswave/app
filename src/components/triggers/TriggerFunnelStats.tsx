import PageTitle from "../sections/PageTitle"
import {Trigger} from "../../types/Trigger"
import {useState} from "react"
import {Period} from "../../types/Period"
import {TriggerStatsLoading} from "./TriggerStatsLoading"
import {ResponsiveFunnel} from "@nivo/funnel"

type Props = {
    title: string
    trigger: Trigger
    publicDashboard?: string | undefined
    defaultPeriod: Period
    defaultDate?: string
    hideViewSwitcher?: boolean
    compareWithPrevious?: boolean
}

export function TriggerFunnelStats(
    {
        title,
        trigger,
        publicDashboard,
        defaultPeriod,
        defaultDate,
        hideViewSwitcher = false,
        compareWithPrevious = false,
    }: Props,
) {
    const [statsLoading, setStatsLoading] = useState(false)
    const [data, setData] = useState([
        {
            "id": "step_sent",
            "value": 82842,
            "label": "Sent",
        },
        {
            "id": "step_viewed",
            "value": 71321,
            "label": "Viewed",
        },
        {
            "id": "step_clicked",
            "value": 59421,
            "label": "Clicked",
        },
        {
            "id": "step_add_to_card",
            "value": 47247,
            "label": "Add To Card",
        },
        {
            "id": "step_purchased",
            "value": 12448,
            "label": "Purchased",
        },
    ])

    if (statsLoading) {
        return (<TriggerStatsLoading/>)
    }

    return (
        <div className="h-full flex flex-col justify-between min-h-[550px]">
            <div className="pb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-start sm:items-center justify-between">
                <PageTitle
                    title={title ?? "Funnel"}
                />
            </div>

            <ResponsiveFunnel
                data={data}
                theme={{
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
                }}
                direction="horizontal"
                spacing={5}
                valueFormat=" >-.4s"
                colors={[
                    "var(--color-funnel-1)",
                    "var(--color-funnel-2)",
                    "var(--color-funnel-3)",
                    "var(--color-funnel-4)",
                    "var(--color-funnel-5)",
                    "var(--color-funnel-6)",
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
    )
}
