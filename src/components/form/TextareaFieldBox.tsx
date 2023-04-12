import React from "react"

type Props = {
    value: string,
    disabled?: boolean,
    setValue: (value: string) => void,
    error?: false | string,
    label: string,
    focus?: boolean,
    required?: boolean,
    name: string,
    placeholder: string
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
            placeholder,
        }: Props,
) {
    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                    <label className="text-xs pt-4 px-4 pb-1 transition-all group-focus-within::opacity-100 duration-300 opacity-50 dark:opacity-60 group-hover:opacity-80 group-focus-within:opacity-100 hover:group-focus-within:opacity-100"
                           htmlFor={name}>
                        {label}
                    </label>

                    <textarea className={`pt-1 px-4 bg-transparent outline-none placeholder:opacity-70 ` + (error ? "pb-2" : "pb-4")}
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
