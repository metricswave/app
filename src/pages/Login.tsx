import InputFieldBox from "../components/form/InputFieldBox"
import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import {LinkButton, NoLinkButton} from "../components/buttons/LinkButton"
import {FormEvent, useState} from "react"
import {fetchApi} from "../helpers/ApiFetcher"
import {Tokens} from "../types/Token"
import {DeviceName} from "../storage/DeviceName"
import FormErrorMessage from "../components/form/FormErrorMessage"
import {useNavigate} from "react-router-dom"
import {useAuthState} from "../storage/AuthToken"
import eventTracker from "../helpers/EventTracker"
import SocialAuth from "../components/social/SocialAuth"

export default function Login() {
    const navigate = useNavigate()
    const {setTokens} = useAuthState()
    const [withEmail, setWithEmail] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | false>(false)
    const [errors, setErrors] = useState<{ email: false | string, password: false | string }>({
        email: false,
        password: false,
    })

    const isValid = (): boolean => {
        let hasErrors = false
        let e = {}

        if (email === "") {
            e = {...e, email: "Email is required"}
        } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            hasErrors = true
            e = {...e, email: "Invalid email"}
        } else {
            e = {...e, email: false}
        }

        if (password === "") {
            hasErrors = true
            e = {...e, password: "Passwords is required"}
        } else {
            e = {...e, password: false}
        }

        setErrors({...errors, ...e})

        return !hasErrors
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        eventTracker.track("Login")

        if (!isValid()) return

        setLoading(true)
        setFormError(false)

        fetchApi<Tokens>("/login", {
            method: "POST",
            body: {
                email,
                password,
                device_name: DeviceName.name(),
            },
            success: (data) => {
                setTokens(data.data)
                navigate("/")
                setLoading(false)
            },
            error: (data) => {
                setFormError(data.message)
                setLoading(false)
            },
            catcher: (data) => {
                setFormError("Something went wrong.<br/>Please try again later.")
                setLoading(false)
            },
        })

    }

    return (
            <Authentication footer={
                <>
                    <p className="text-sm">
                        Forgot your password? <LinkButton href="/auth/forgot-password" text="Reset Password →"/>
                    </p>
                    <p className="text-sm">
                        Do not have an account? <LinkButton href="/auth/signup" text="Sign Up →"/>
                    </p>
                </>
            }>
                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="pb-10 leading-relaxed flex flex-col space-y-2">
                        <p className="font-bold">Log In</p>
                        <p className="text-sm">Access into your account with social networks or with your email and
                            password.</p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        {!withEmail && <div>
                            <SocialAuth/>

                            <NoLinkButton text="or Log In with Email"
                                          className="block w-full text-center p-3"
                                          onClick={(e) => {
                                              e.preventDefault()
                                              setWithEmail(true)
                                          }}
                                          loading={false}/>
                        </div>}

                        {withEmail && (
                                <>
                                    <InputFieldBox value={email}
                                                   focus
                                                   setValue={setEmail}
                                                   label="Email"
                                                   name="email"
                                                   placeholder="john-doe@email.com"
                                                   type="email"/>

                                    <InputFieldBox value={password}
                                                   setValue={setPassword}
                                                   label="Password"
                                                   name="password"
                                                   placeholder="Password"
                                                   type="password"/>

                                    <FormErrorMessage error={formError}/>

                                    <PrimaryButton text="Log In" loading={loading}/>

                                    <NoLinkButton text="Back"
                                                  className="w-full text-center text-sm pt-4"
                                                  onClick={(e) => {
                                                      e.preventDefault()
                                                      setWithEmail(false)
                                                  }}/>
                                </>
                        )}
                    </div>
                </form>
            </Authentication>
    )
}
