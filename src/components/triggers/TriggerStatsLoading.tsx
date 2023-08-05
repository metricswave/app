import { Component } from "react";
import CircleArrowsIcon from "../icons/CircleArrowsIcon";

export class TriggerStatsLoading extends Component {
    render() {
        return (
            <div className="">
                <div className="flex flex-col gap-4 items-center animate-pulse py-20 justify-center">
                    <CircleArrowsIcon className="animate-spin h-6" />
                    <div>Loading…</div>
                </div>
            </div>
        );
    }
}
