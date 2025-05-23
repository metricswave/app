import React, { ChangeEvent, InputHTMLAttributes, useEffect, useState } from "react";
import InputLabel from "./InputLabel";
import { twMerge } from "../../helpers/TwMerge";

type Props = InputHTMLAttributes<any> & {
    value: string;
    disabled?: boolean;
    setValue: (value: string) => void;
    error?: false | string;
    label?: string;
    focus?: boolean;
    required?: boolean;
    showRequired?: boolean;
    name: string;
    type?: string;
    placeholder: string;
    inputClassName?: string;
    autoComplete?: string;
    debounceMsDelay?: number;
};

export default function InputFieldBox({
    value,
    setValue,
    error,
    label = "",
    name,
    type = "text",
    disabled = false,
    focus = false,
    required = false,
    showRequired = false,
    placeholder,
    className = "",
    inputClassName = "",
    debounceMsDelay = 0,
    autoComplete = undefined,
    ...props
}: Props) {
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setValue(inputValue);
        }, debounceMsDelay);
        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    return (
        <>
            <div
                className={[
                    "flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600 w-full",
                    className,
                ].join(" ")}
            >
                {label?.length > 0 && (
                    <InputLabel name={name} label={label} required={required} showRequired={showRequired} />
                )}

                <input
                    className={twMerge(
                        "pt-1 px-4 bg-transparent outline-none placeholder:opacity-70",
                        { "pt-4": label?.length === 0 },
                        { "pb-2": type === "time" || error },
                        { "pb-4": !(type === "time" || error) },
                        inputClassName,
                    )}
                    value={inputValue}
                    onChange={handleInputChange}
                    type={type}
                    name={name}
                    autoFocus={focus}
                    disabled={disabled}
                    id={name}
                    required={required}
                    placeholder={placeholder}
                    autoComplete={autoComplete ?? "off"}
                    {...props}
                />

                {type === "time" && (
                    <p className={`text-xs opacity-60 px-4 ` + (error ? "pb-2" : "pb-4")}>
                        Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </p>
                )}

                {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}
            </div>
        </>
    );
}
