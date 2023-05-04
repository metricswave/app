import React, {useState} from "react"
import InputLabel from "./InputLabel"

type Props = {
    value: string[],
    disabled?: boolean,
    setValue: (value: string[]) => void,
    error?: false | string,
    label: string,
    focus?: boolean,
    required?: boolean,
    showRequired?: boolean,
    name: string,
    placeholder: string
}

export default function ParametersFieldBox(
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
            placeholder,
        }: Props,
) {
    const [viewValue, setViewValue] = useState<string>(value.join("\n"))

    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                    <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                    <textarea className={`pt-1 px-4 h-32 bg-transparent outline-none placeholder:opacity-70 pb-2`}
                              onChange={e => {
                                  const fieldValue = e.target.value
                                  setViewValue(fieldValue)
                                  setValue(
                                          fieldValue.split("\n")
                                                  .map(line => line.trim().replaceAll("{", "").replaceAll("}", ""))
                                                  .filter((line) => line !== ""),
                                  )
                              }}
                              name={name}
                              autoFocus={focus}
                              disabled={disabled}
                              id={name}
                              value={viewValue}
                              required={required}
                              placeholder={placeholder}
                    />

                    <p className={`text-xs opacity-50 pt-2 px-4 leading-normal ` + (error ? "pb-2" : "pb-4")}>
                        Add on parameter per line, you can use this parameters in the notification title or content. For
                        example, if you add
                        a <code className="bg-gray-100 dark:bg-gray-700 rounded-sm p-0.5">email</code> param,
                        you can add in the
                        title <code className="bg-gray-100 dark:bg-gray-700 rounded-sm p-0.5">{"{email}"}</code> and it
                        will be replaced.
                    </p>

                    {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}

                </div>
            </>
    )
}
