import React from "react"
import InputLabel from "./InputLabel"
import CheckboxInput from "./CheckboxInput"
import RadioGroupComponent from "./RadioGroupComponent"

type Props = {
    value: string | string[],
    setValue: (value: string | string[]) => void,
    error?: false | string,
    label: string,
    name: string,
    multiple?: boolean,
    required?: boolean,
    showRequired?: boolean,
}

const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
const radioWeekDays = weekDays.map((day) => ({label: day.charAt(0).toUpperCase() + day.slice(1), value: day}))

export default function WeekdayFieldBox(
        {
            value,
            name,
            setValue,
            error,
            label,
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
                        {multiple && Array.isArray(value) && weekDays.map((day) => (
                                <div className="pl-4" key={day}>
                                    <CheckboxInput
                                            name={name + "_" + day}
                                            label={day.charAt(0).toUpperCase() + day.slice(1)}
                                            checked={value.includes(day)}
                                            onCheckedChanged={(status) => {
                                                if (status) {
                                                    setValue([...value, day])
                                                } else if (Array.isArray(value)) {
                                                    setValue(value.filter(v => v !== day))
                                                }
                                            }}
                                    />
                                </div>
                        ))}

                        {!multiple && (<div className="pl-4">
                                    <RadioGroupComponent
                                            name={name}
                                            values={radioWeekDays}
                                            onChange={setValue}
                                    />
                                </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}
                </div>
            </>
    )
}
