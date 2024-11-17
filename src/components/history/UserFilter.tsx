import InputFieldBox from "../form/InputFieldBox";

type Props = {
    filter: string;
    setFilter: (value: string) => void;
};

export default function UserFilter({ filter, setFilter }: Props) {
    return (
        <InputFieldBox
            value={filter}
            setValue={setFilter}
            error={false}
            name="filter"
            label="User"
            placeholder="Filter by user id"
            debounceMsDelay={500}
        />
    );
}
