import Logo from "../components/logo/Logo";
import InputFieldBox from "../components/form/InputFieldBox";
import PrimaryButton from "../components/form/PrimaryButton";
import {useAuthContext} from "../contexts/AuthContext";
import {useState} from "react";
import {fetchAuthApi} from "../helpers/ApiFetcher";

type Props = {
    onFinish: () => void
}

export function WelcomeDomainStep(
    {
        onFinish,
    }: Props
) {
    const context = useAuthContext()
    const currentTeamId = context.teamState.currentTeamId
    const [loading, setLoading] = useState(false)
    const [domain, setDomain] = useState("")
    const [domainError, setDomainError] = useState("")

    return (
        <div className="max-w-[600px] px-4 py-12 mx-auto flex flex-col space-y-14">
            <Logo/>

            <div className="flex flex-col space-y-4">
                <h2 className="text-xl sm:text-2xl">
                    Welcome 👋!
                </h2>

                <p className="sm:text-lg pt-3">
                    You are almost ready to start tracking your metrics.
                </p>

                <p className="sm:text-lg font-bold">What domain are you going to track?</p>

                <div>
                    <InputFieldBox
                        autoFocus={true}
                        setValue={setDomain}
                        name="domain"
                        label="Domain"
                        value={domain}
                        error={domainError}
                        placeholder="example.com"
                        className="w-full"
                    />

                    <PrimaryButton
                        text="Continue →"
                        loading={loading}
                        className={"w-full mt-4"}
                        onClick={() => {
                            if (!domain) {
                                setDomainError("Please enter a domain")
                                return
                            }

                            if (!domain.includes(".") || domain.includes(" ")) {
                                setDomainError("Please enter a valid domain (e.g. example.com)")
                            }

                            setLoading(true)

                            fetchAuthApi(`/teams/${currentTeamId}`, {
                                method: "PUT",
                                body: {
                                    domain,
                                    change_dashboard_name: true,
                                },
                                success: onFinish,
                                error: (e) => {
                                    setLoading(false)
                                    setDomainError(e.message)
                                },
                                catcher: (e) => {
                                    setLoading(false)
                                    setDomainError(e.message)
                                },
                            })

                        }}
                    />
                </div>
            </div>
        </div>
    )
}
