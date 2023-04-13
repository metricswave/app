import React from "react"
import InputLabel from "./InputLabel"

type Props = {
    value: string | string[],
    disabled?: boolean,
    setValue: (value: string | string[]) => void,
    error?: false | string,
    label: string,
    name: string,
    focus?: boolean,
    multiple?: boolean,
    required?: boolean,
    showRequired?: boolean,
}

const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export default function WeekdayFieldBox(
        {
            value,
            name,
            setValue,
            error,
            label,
            disabled = false,
            focus = false,
            multiple = false,
            required = false,
            showRequired = false,
        }: Props,
) {
    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                    <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                    <div className="flex flex-col space-y-2 pt-3 pb-4">
                        {multiple && Array.isArray(value) && weekDays.map((day, index) => (
                                <div className="pl-4" key={day}>
                                    <label className="flex flex-row space-x-4">
                                        <input type="checkbox"
                                               name={name}
                                               disabled={disabled}
                                               autoFocus={focus && index === 0}
                                               value={day}
                                               checked={value.includes(day)}
                                               onChange={e => {
                                                   if (e.target.checked) {
                                                       setValue([...value, day])
                                                   } else if (Array.isArray(value)) {
                                                       setValue(value.filter(v => v !== day))
                                                   }
                                               }}/>
                                        <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                    </label>
                                </div>
                        ))}

                        {!multiple && weekDays.map((day, index) => (
                                <div className="pl-4" key={day}>
                                    <label className="flex flex-row space-x-4">
                                        <input type="radio"
                                               name={name}
                                               disabled={disabled}
                                               autoFocus={focus && index === 0}
                                               value={day}
                                               checked={value.includes(day)}
                                               onChange={() => setValue(day)}
                                        />
                                        <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                    </label>
                                </div>
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}
                </div>
            </>
    )
}
