import SectionContainer from "../../components/sections/SectionContainer";
import React from "react";
import PageTitle from "../../components/sections/PageTitle";
import { useSearchParams } from "react-router-dom";
import ChannelToConnect from "../../components/services/ChannelToConnect";
import { useChannelsState } from "../../storage/Channels";
import { useTeamChannelsState } from "../../storage/TeamChannels";
import UserChannelBlock from "../../components/user_services/UserChannelBlock";

export default function SettingsChannels() {
    const { channels } = useChannelsState();
    const { teamChannels, reloadTeamChannels } = useTeamChannelsState();
    const [searchParams] = useSearchParams();

    React.useEffect(() => {
        if (searchParams.get("connected") === "true") {
            reloadTeamChannels();
        }
    }, [searchParams]);

    const availableToCreateChannels = channels.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <>
            {/* Connected services */}
            {teamChannels.length > 0 && (
                <SectionContainer size={"big"} align={"left"}>
                    <PageTitle title="Services" description="Currently connected services." />

                    {teamChannels.map((teamChannel) => {
                        const channel = channels.find((c) => c.id === teamChannel.channel_id)!;

                        if (channel === undefined) {
                            return <div key={teamChannel.id}></div>;
                        }

                        return (
                            <UserChannelBlock
                                teamChannel={teamChannel}
                                key={teamChannel.id}
                                channel={channel}
                                onDeleted={reloadTeamChannels}
                            />
                        );
                    })}
                </SectionContainer>
            )}

            {/* Available services */}
            {availableToCreateChannels.length > 0 && (
                <SectionContainer size={"big"} align={"left"}>
                    <PageTitle
                        title="Available"
                        description="Connect with more services to be able to use more triggers."
                    />

                    {availableToCreateChannels.map((channel) => (
                        <ChannelToConnect
                            key={channel.id}
                            channel={channel}
                            loading={false}
                            onConnected={reloadTeamChannels}
                        />
                    ))}
                </SectionContainer>
            )}
        </>
    );
}
