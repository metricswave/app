import React from "react"

type Props = {
    value: string,
    disabled?: boolean,
    setValue: (value: string) => void,
    focus?: boolean,
    name: string,
    type?: string,
    placeholder: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchInputField(
        {
            value,
            setValue,
            name,
            type = "search",
            disabled = false,
            focus = false,
            placeholder,
            ...props
        }: Props,
) {
    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                    <input className={`py-2 px-2.5 outline-none placeholder:opacity-70 rounded-sm bg-white/50 focus-within:bg-white/75 dark:bg-zinc-500/5 dark:focus-within:bg-zinc-500/10`}
                           value={value}
                           onChange={e => setValue(e.target.value)}
                           type={type}
                           name={name}
                           autoFocus={focus}
                           disabled={disabled}
                           id={name}
                           placeholder={placeholder}
                           {...props}
                    />

                </div>
            </>
    )
}
