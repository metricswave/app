import TriggerIcon from "../components/icons/TriggerIcon"

type Props = {
    children?: React.ReactNode
}

export default function TriggersPageEmptyState({children}: Props) {
    return (
            <div className="-mt-10 h-screen flex flex-col items-center justify-center">
                <div className="text-center max-w-[370px]">
                    <TriggerIcon className="inline-block mb-4 h-10 w-10 opacity-10"/>
                    <p className="opacity-50">Triggers allow you to<br/>send notifications when<br/>something happens.
                    </p>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
                <div className="h-[200px]"></div>
            </div>
    )
}
