import InputFieldBox from "../form/InputFieldBox";

type Props = {
    filter: string;
    setFilter: (value: string) => void;
    submit: () => void;
};

export default function UserFilter({ filter, setFilter, submit }: Props) {
    return (
        <>
            <div className="text-right pb-1">
                <a
                    href="/documentation/tracking/user-id"
                    target="_blank"
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
        </>
    );
}
