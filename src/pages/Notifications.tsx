import React from "react"
import {AuthContext} from "../contexts/AuthContext"

export default function Notifications() {
    const {user} = React.useContext(AuthContext)
    return (
            <>
                <h1>Notifications</h1>
                {
                    user
                            ? <p>Logged in as {user.name}</p>
                            : <p>Not logged in</p>
                }
            </>
    )
}
