import InputLabel from "./InputLabel"
import {twMerge} from "../../helpers/TwMerge";


type Props = {
    value: string | string[],
    options: { label: string, value: string }[],
    setValue: (value: string | string[]) => void,
    error?: false | string,
    label?: string,
    name: string,
    multiple?: boolean,
    required?: boolean,
    showRequired?: boolean,
    className?: string,
    selectClassName?: string,
    wrapperClassName?: string,
}


export default function DropDownSelectFieldBox(
    {
        value,
        name,
        options,
        setValue,
        error,
        label = "",
        required = false,
        showRequired = false,
        className = "",
        selectClassName = "",
        wrapperClassName = "",
    }: Props,
) {
    return (
        <>
            <div className={twMerge([
                "flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600",
                className,
            ])}>

                {label?.length > 0 && (
                    <InputLabel name={name}
                                label={label}
                                required={required}
                                showRequired={showRequired}/>
                )}

                <div className={twMerge("flex flex-col space-y-2 pt-0 pb-1", wrapperClassName)}>
                    <select
                        className={twMerge(["bg-transparent py-3 mx-3", selectClassName])}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        name={name}
                    >
                        {options.map((option) => (
                            <option key={option.value}
                                    value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}
            </div>
        </>
    )
}
