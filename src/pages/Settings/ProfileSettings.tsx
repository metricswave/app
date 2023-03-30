import {AuthContext} from "../../contexts/AuthContext"
import {User} from "../../types/User"
import {useContext, useState} from "react"

export default function ProfileSettings() {
    const {user} = useContext(AuthContext) as { user: User }
    const [deleteAccount, setDeleteAccount] = useState(false)

    const handleAccountDeletion = () => {
        alert("This will work in the future")
    }

    return (
            <div className="flex flex-col space-y-6">
                <h1 className="font-bold">Profile</h1>

                <div className="flex flex-col space-y-2">
                    <div className="font-bold">Name</div>
                    <div className="opacity-70">{user.name}</div>
                </div>

                <div className="flex flex-col space-y-2">
                    <div className="font-bold">Email</div>
                    <div className="opacity-70">{user.email}</div>
                </div>

                <div className="flex flex-col space-y-3">
                    <div className="font-bold mt-10">Danger</div>
                    <div className="flex flex-col space-y-2">
                        {!deleteAccount
                                ? (
                                        <div className="flex flex-row space-x-2">
                                            <span className="font-bold">Want to delete your account?</span>
                                            <span onClick={() => setDeleteAccount(true)}
                                                  className="cursor-pointer underline text-red-500 opacity-70 hover:opacity-100 smooth">Yes</span>
                                        </div>
                                ) : (
                                        <div className="max-w-[600px] flex flex-col space-y-4">
                                            <p className="mb-1">
                                                <span className="font-bold">This step is not reversible.</span> You
                                                will lost all your notifications history, triggers, and more.
                                            </p>

                                            <span className="cursor-pointer underline text-red-500 opacity-70 hover:opacity-100 smooth"
                                                  onClick={handleAccountDeletion}>
                                                I know, delete my account
                                            </span>

                                            <span className="cursor-pointer underline opacity-70 hover:opacity-100 smooth"
                                                  onClick={() => setDeleteAccount(false)}>
                                                Cancel
                                            </span>
                                        </div>
                                )
                        }
                    </div>
                </div>
            </div>
    )
}
