import {generateUuid} from "../helpers/UuidGenerator"

export const DeviceName = {
    name: () => {
        let deviceName = localStorage.getItem("nw:device_name")

        if (!deviceName) {
            deviceName = generateUuid()
            localStorage.setItem("nw:device_name", deviceName)
        }

        return deviceName
    },
}
