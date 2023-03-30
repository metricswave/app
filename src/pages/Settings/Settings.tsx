import {Outlet} from "react-router-dom"
import SettingsMenu from "./SettingsMenu"

export default function Settings() {
    return (
            <div className="flex flex-col sm:flex-row min-h-screen">

                <SettingsMenu/>

                <div className="p-8 w-full">
                    <Outlet/>
                </div>
            </div>
    )
}
