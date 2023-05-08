import React from "react"
import InputLabel from "./InputLabel"
import CheckboxInput from "./CheckboxInput"
import RadioGroupComponent from "./RadioGroupComponent"

type Props = {
    value: string | string[],
    options: { label: string, value: string }[],
    setValue: (value: string | string[]) => void,
    error?: false | string,
    label: string,
    name: string,
    multiple?: boolean,
    required?: boolean,
    showRequired?: boolean,
}


export default function SelectFieldBox(
        {
            value,
            name,
            options,
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
                        {multiple && Array.isArray(value) && options.map(({label, value: key}) => {
                            return (
                                    <div className="pl-4" key={key}>
                                        <CheckboxInput
                                                name={name + "_" + key}
                                                label={label}
                                                checked={value.includes(key)}
                                                onCheckedChanged={(status) => {
                                                    if (status) {
                                                        setValue([...value, key])
                                                    } else if (Array.isArray(value)) {
                                                        setValue(value.filter(v => v !== key))
                                                    }
                                                }}
                                        />
                                    </div>
                            )
                        })}

                        {!multiple && (<div className="pl-4">
                                    <RadioGroupComponent
                                            name={name}
                                            value={value as string}
                                            values={options}
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
