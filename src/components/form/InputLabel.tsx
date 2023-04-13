import React from "react"

export default function InputLabel(
        {
            name,
            label,
            required,
            showRequired,
        }: { name: string, label: string, required?: boolean, showRequired?: boolean },
) {
    return (
            <label className="text-xs pt-4 px-4 pb-1 transition-all group-focus-within::opacity-100 duration-300 opacity-50 dark:opacity-60 group-hover:opacity-80 group-focus-within:opacity-100 hover:group-focus-within:opacity-100"
                   htmlFor={name}>
                {label}
                {required && showRequired && <span className="pl-2 text-red-500">*</span>}
            </label>
    )
}
