import React, {useEffect} from "react"
import InputLabel from "./InputLabel"
import * as ScrollArea from "@radix-ui/react-scroll-area"

export type LocationValue = {
    city: string,
    country: string,
    latitude: number,
    longitude: number,
}

type Props = {
    value: LocationValue | undefined,
    setValue: (value: LocationValue) => void,
    error?: false | string,
    label: string,
    name: string,
    required?: boolean,
    showRequired?: boolean,
    focus?: boolean,
}

export default function LocationFieldBox(
        {
            value,
            name,
            setValue,
            error,
            label,
            required = false,
            showRequired = false,
            focus = false,
        }: Props,
) {
    const [locations, setLocations] = React.useState<LocationValue[]>([])
    const [visibleValue, setVisibleValue] = React.useState<string>(
            value?.city !== undefined ? `${value.city}, ${value.country}` : "",
    )
    const [selected, setSelected] = React.useState<string>(
            value?.city !== undefined ? `${value.city}, ${value.country}` : "",
    )

    useEffect(() => {
        if (visibleValue.length < 3 || selected === visibleValue) {
            setLocations([])
            return
        }

        const timeOutId = setTimeout(() => {
            fetch(
                    "https://geocoding-api.open-meteo.com/v1/search?name=" + visibleValue
                    + "&count=10&language=en&format=json",
            )
                    .then(result => result.json())
                    .then((result: {
                        results: { name: string, country: string, latitude: number, longitude: number }[]
                    }) => {
                        const unique = result.results.filter((v, i, a) => a
                                .findIndex(t => (t.name === v.name && t.country === v.country)) === i,
                        )

                        setLocations(unique.map(l => ({
                            city: l.name,
                            country: l.country,
                            latitude: l.latitude,
                            longitude: l.longitude,
                        })))
                    })
        }, 250)
        return () => clearTimeout(timeOutId)
    }, [visibleValue])

    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                    <InputLabel name={name} label={label} required={required} showRequired={showRequired}/>

                    <input className={`pt-1 px-4 bg-transparent outline-none placeholder:opacity-70 ` + (locations.length > 0 ? "pb-2" : "pb-4")}
                           value={visibleValue}
                           onChange={e => setVisibleValue(e.target.value)}
                           type="text"
                           name={name}
                           autoFocus={focus}
                           id={name}
                           autoComplete="off"
                           required={required}
                           placeholder="Choose a Location"/>

                    {locations.length > 0 &&
                            <ScrollArea.Root className={"w-full h-[165px] overflow-hidden bg-white " + (error ? "pb-2" : "pb-4")}>
                                <ScrollArea.Viewport className="w-full h-full">
                                    <div className="px-4">
                                        {locations.map((location) => (
                                                <div
                                                        className="cursor-pointer opacity-60 hover:bg-zinc-100 hover:opacity-100 smooth text-sm rounded-sm px-2.5 py-2.5 border-t soft-border"
                                                        key={`${location.latitude}-${location.longitude}`}
                                                        onClick={() => {
                                                            setValue(location)
                                                            setSelected(`${location.city}, ${location.country}`)
                                                            setVisibleValue(`${location.city}, ${location.country}`)
                                                            setLocations([])
                                                        }}
                                                >
                                                    {location.city}, {location.country}
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
