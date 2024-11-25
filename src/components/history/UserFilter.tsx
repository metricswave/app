import { useState } from "react";
import InputFieldBox from "../form/InputFieldBox";
import PrimaryButton from "../form/PrimaryButton";

type Props = {
    submit: (filter: string) => void;
};

export default function UserFilter({ submit: parentSubmit }: Props) {
    const [filter, setFilter] = useState<string>("");
    const [submitedFilter, setSubmitedFilter] = useState<string>("");

    const submit = () => {
        setSubmitedFilter(filter);
        parentSubmit(filter);
    };

    return (
        <>
            <div className="text-right pb-1">
                <a
                    href="https://metricswave.com/documentation/tracking/user-id"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs border-b border-dotted text-blue-500 border-blue-500 opacity-70 hover:border-solid hover:opacity-100"
                >
                    How to track user-ids?
                </a>
            </div>

            <InputFieldBox
                value={filter}
                setValue={setFilter}
                error={false}
                name="filter"
                label="User"
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        submit();
                    }
                }}
                autoFocus
                placeholder="Filter by user id"
            />

            {submitedFilter !== filter && filter.length > 0 && (
                <PrimaryButton text="Search" className="w-full mt-3" onClick={submit} />
            )}
        </>
    );
}
