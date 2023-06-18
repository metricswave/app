import React from "react"
import InputLabel from "./InputLabel"

type Props = {
    value: string,
    disabled?: boolean,
    setValue: (value: string) => void,
    error?: false | string,
    label: string,
    focus?: boolean,
    required?: boolean,
    showRequired?: boolean,
    name: string,
    placeholder: string
    height?: string
}

export default function TextareaFieldBox(
    {
        value,
        setValue,
        error,
        label,
        name,
        disabled = false,
        focus = false,
        required = false,
        showRequired = false,
        height = "h-[180px]",
        placeholder,
    }: Props,
) {
    return (
        <>
            <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                <textarea className={[
                    `${height} pt-1 px-4 bg-transparent outline-none placeholder:opacity-70 `,
                    (error ? "pb-2" : "pb-4"),
                ].join(" ")}
                          onChange={e => setValue(e.target.value)}
                          name={name}
                          autoFocus={focus}
                          disabled={disabled}
                          id={name}
                          value={value}
                          required={required}
                          placeholder={placeholder}
                />

                {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}

            </div>
        </>
    )
}
