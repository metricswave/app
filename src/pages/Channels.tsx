import SectionContainer from "../components/sections/SectionContainer"
import React, {useState} from "react"
import PageTitle from "../components/sections/PageTitle"
import {useSearchParams} from "react-router-dom"
import {Service} from "../types/Service"
import ChannelToConnect from "../components/services/ChannelToConnect"
import {connectServiceMethod} from "../components/services/ConnectServiceMethod"
import {useChannelsState} from "../storage/Channels";
import {useTeamChannelsState} from "../storage/TeamChannels";
import UserChannelBlock from "../components/user_services/UserChannelBlock";

export default function Channels() {
    const {channels} = useChannelsState()
    const {teamChannels, reloadTeamChannels} = useTeamChannelsState()
    const [loading, setLoading] = useState<false | string>(false)
    const [searchParams] = useSearchParams()

    React.useEffect(() => {
        if (searchParams.get("connected") === "true") {
            reloadTeamChannels()
        }
    }, [searchParams])

    const availableToCreateChannels = channels.sort((a, b) => a.name.localeCompare(b.name))

    const connectService = async (service: Service) => {
        setLoading(service.driver)
        await connectServiceMethod(service, true)
        setLoading(false)
    }

    return (
        <>
            {/* Connected services */}
            {teamChannels.length > 0 && <SectionContainer>
                <PageTitle title="Services"
                           description="Currently connected services."/>

                {teamChannels.map((teamChannel) => {
                    const channel = channels.find((c) => c.id === teamChannel.channel_id)!

                    if (channel === undefined) {
                        return (<div key={teamChannel.id}></div>)
                    }

                    return (<UserChannelBlock
                        teamChannel={teamChannel}
                        key={teamChannel.id}
                        channel={channel}
                        onDeleted={reloadTeamChannels}
                    />)
                })}
            </SectionContainer>}

            {/* Available services */}
            {availableToCreateChannels.length > 0 && <SectionContainer>
                <PageTitle
                    title="Available"
                    description="Connect with more services to be able to use more triggers."
                />

                {availableToCreateChannels.map((channel) =>
                    <ChannelToConnect
                        key={channel.id}
                        channel={channel}
                        loading={loading === channel.driver}
                        onConnected={reloadTeamChannels}
                    />,
                )}
            </SectionContainer>}
        </>
    )
}
