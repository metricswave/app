import React, {useEffect} from "react"
import InputLabel from "./InputLabel"
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService"
import {app} from "../../config/app"
import * as ScrollArea from "@radix-ui/react-scroll-area"

type Props = {
    value: string | undefined
    disabled?: boolean,
    setValue: (value: string) => void,
    error?: false | string,
    label: string,
    focus?: boolean,
    required?: boolean,
    showRequired?: boolean,
    name: string,
    placeholder: string
}

export default function AddressFieldBox(
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
            ...props
        }: Props,
) {
    const {placePredictions, getPlacePredictions} = usePlacesAutocompleteService({apiKey: app.googleMapsApiKey})
    const [selected, setSelected] = React.useState<string | undefined>(value)
    const [visibleValue, setVisibleValue] = React.useState<string>(value ?? "")
    const addresses: string[] = placePredictions.map((prediction) => prediction.description)

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            getPlacePredictions({input: visibleValue})
        }, 250)
        return () => clearTimeout(timeOutId)
    }, [visibleValue])

    return (
            <>
                <div className="flex flex-col relative border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600 w-full">

                    <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                    <input className={`pt-1 px-4 bg-transparent outline-none placeholder:opacity-70 ` + (addresses.length > 0 ? "pb-2" : "pb-4")}
                           value={visibleValue}
                           onChange={e => setVisibleValue(e.target.value)}
                           type="text"
                           name={name}
                           autoFocus={focus}
                           id={name}
                           autoComplete="off"
                           required={required}
                           placeholder={placeholder}
                    />

                    {addresses.length > 0 && selected !== visibleValue &&
                            <ScrollArea.Root className={"w-full h-[165px] overflow-hidden bg-white dark:bg-zinc-900 absolute bottom-0 " + (error ? "pb-2" : "pb-4")}>
                                <ScrollArea.Viewport className="w-full h-full">
                                    <div className="px-4">
                                        {addresses.map((a, k) => (
                                                <div
                                                        className="cursor-pointer opacity-60 hover:bg-zinc-100 hover:dark:bg-zinc-800 hover:opacity-100 smooth text-sm rounded-sm px-2.5 py-2.5 border-t soft-border"
                                                        key={k}
                                                        onClick={() => {
                                                            setVisibleValue(a)
                                                            setSelected(a)
                                                            setValue(a)
                                                        }}
                                                >
                                                    {a}
                                                </div>
                                        ))}
                                    </div>
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar
                                        className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                                        orientation="vertical"
                                >
                                    <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"/>
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Scrollbar
                                        className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                                        orientation="horizontal"
                                >
                                    <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"/>
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Corner className="bg-blackA8"/>
                            </ScrollArea.Root>}

                    {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}

                </div>
            </>
    )
}
