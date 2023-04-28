import * as Checkbox from "@radix-ui/react-checkbox"
import {CheckIcon} from "@radix-ui/react-icons"
import InputLabel from "./InputLabel"

type Props = {
    name: string
    label: string
    values: Array<CheckboxGroupValue>
    required?: boolean
    showRequired?: boolean
    onCheckedChanged: (value: Array<CheckboxGroupValue>) => void
}

export type CheckboxGroupValue = { value: string, label: string, checked: boolean }

export default function CheckboxInputGroup(
        {
            name,
            label,
            required = false,
            showRequired = true,
            values,
            onCheckedChanged: checkedChanged,
        }: Props,
) {
    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                    <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                    <div className="flex flex-col space-y-2 pt-3 pb-4">

                        {values.map(({value, label, checked}) => (
                                <div key={`${name}_${value}`} className="flex items-start pl-4">
                                    <Checkbox.Root
                                            className="smooth flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700 outline-none"
                                            checked={checked}
                                            onCheckedChange={(state) => {
                                                const newValues = values.map((v) => {
                                                    if (v.value === value) {
                                                        return {...v, checked: state === true}
                                                    }
                                                    return v
                                                })

                                                checkedChanged(newValues)
                                            }}
                                            id={`${name}_${value}`}
                                    >
                                        <Checkbox.Indicator className="text-blue-500 dark:text-blue-300">
                                            <CheckIcon className="h-[20px] w-[20px]"/>
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <label className="pl-[15px] w-full" htmlFor={`${name}_${value}`}>
                                        {label}
                                    </label>
                                </div>
                        ))}

                    </div>
                </div>
            </>
    )
}
