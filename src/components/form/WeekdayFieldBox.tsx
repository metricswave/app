import React from "react"
import SelectFieldBox from "./SelectFieldBox"

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

export type WeekDaysType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

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
            <SelectFieldBox
                    value={value}
                    multiple={multiple}
                    error={error}
                    required={required}
                    showRequired={showRequired}
                    options={[
                        {label: "Monday", value: "monday"},
                        {label: "Tuesday", value: "tuesday"},
                        {label: "Wednesday", value: "wednesday"},
                        {label: "Thursday", value: "thursday"},
                        {label: "Friday", value: "friday"},
                        {label: "Saturday", value: "saturday"},
                        {label: "Sunday", value: "sunday"},
                    ]}
                    setValue={setValue}
                    label={label}
                    name={name}
            />
    )
}
