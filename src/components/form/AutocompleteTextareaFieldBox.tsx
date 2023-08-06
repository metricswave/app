import React from "react"
import InputLabel from "./InputLabel"
// @ts-ignore
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete"

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
    placeholder: string
    autocompleteOptions: string[]
    visible?: boolean
}

type Item = { name: string, char: string }
const ItemComponent = ({entity: {name, char}}: { entity: Item }) => <div>{`${char}`}</div>

export default function AutocompleteTextareaFieldBox(
    {
        value,
        setValue,
        error,
        label,
        name,
        autocompleteOptions,
        disabled = false,
        focus = false,
        required = false,
        showRequired = false,
        placeholder,
        visible = true,
    }: Props,
) {
    return (
        <>
            <div className={[
                "relative flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600",
                visible ? "flex" : "hidden",
            ].join(" ")}>

                <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                <ReactTextareaAutocomplete
                    className={`w-full h-[180px] pt-1 px-4 bg-transparent outline-none placeholder:opacity-70 ` + (error ? "pb-2" : "pb-0")}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e: any) => setValue(e.target.value)}
                    minChar={0}
                    loadingComponent={() => <span>Loading</span>}
                    trigger={{
                        "{": {
                            dataProvider: (token: string): Item[] => autocompleteOptions
                                .map((char: string) => ({name: char, char: `{${char}}`}))
                                .filter((item: Item) => token.length === 0 || item.name.includes(token)),
                            component: ItemComponent,
                            output: (item: Item) => item.char,
                        },
                    }}
                    containerClassName="mb-[-.4rem]"
                    listClassName="w-full h-[165px] overflow-y-scroll bg-white dark:bg-zinc-900"
                    itemClassName="cursor-pointer opacity-60 hover:bg-zinc-100 hover:dark:bg-zinc-800 hover:opacity-100 smooth text-sm rounded-sm px-2.5 py-2.5 border-t soft-border"
                    dropdownClassName=""
                />

                {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}

            </div>
        </>
    )
}
