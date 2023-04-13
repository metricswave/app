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
    type?: string,
    placeholder: string
}

export default function InputFieldBox(
        {
            value,
            setValue,
            error,
            label,
            name,
            type = "text",
            disabled = false,
            focus = false,
            required = false,
            showRequired = false,
            placeholder,
        }: Props,
) {
    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600 w-full">

                    <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                    <input className={`pt-1 px-4 bg-transparent outline-none placeholder:opacity-70 ` + (error ? "pb-2" : "pb-4")}
                           value={value}
                           onChange={e => setValue(e.target.value)}
                           type={type}
                           name={name}
                           autoFocus={focus}
                           disabled={disabled}
                           id={name}
                           required={required}
                           placeholder={placeholder}/>

                    {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}

                </div>
            </>
    )
}
