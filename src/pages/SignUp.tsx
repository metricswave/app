import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import {LinkButton, NoLinkButton} from "../components/buttons/LinkButton"
import {FormEvent, useState} from "react"
import {DeviceName} from "../storage/DeviceName"
import {fetchApi} from "../helpers/ApiFetcher"
import {Tokens} from "../types/Token"
import eventTracker from "../helpers/EventTracker"
import SocialAuth from "../components/social/SocialAuth"
import InputFieldBox from "../components/form/InputFieldBox"
import FormErrorMessage from "../components/form/FormErrorMessage"

export default function SignUp() {
    const [withEmail, setWithEmail] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | false>(false)
    const [errors, setErrors] = useState<{
        name: false | string,
        email: false | string,
        password: false | string,
        passwordConfirmation: false | string
    }>({
        name: false,
        email: false,
        password: false,
        passwordConfirmation: false,
    })

    const isValid = (): boolean => {
        let hasErrors = false
        let e = {}

        if (name === "") {
            hasErrors = true
            e = {...e, name: "Name is required"}
        } else {
            e = {...e, name: false}
        }

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
        } else if (password !== passwordConfirmation) {
            hasErrors = true
            e = {...e, passwordConfirmation: "Passwords do not match"}
        } else {
            e = {...e, password: false, passwordConfirmation: false}
        }

        setErrors({...errors, ...e})

        return !hasErrors
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        eventTracker.track("Sign Up")

        if (!isValid()) return

        setLoading(true)
        setFormError(false)

        fetchApi<Tokens>("/signup", {
            method: "POST",
            body: {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                device_name: DeviceName.name(),
            },
            success: (data) => {
                localStorage.setItem("nw:auth", JSON.stringify(data.data))
                window.location.href = "/welcome"
                setLoading(false)

                const referrer = localStorage.getItem("metricswave:referrer") ?? document.referrer
                fetch(`https://metricswave.com/webhooks/f3fcf7cc-416d-4ff9-bc12-3878e9127ff7?email=${email}&referrer=${referrer}&step=1`)
            },
            error: (data) => {
                setFormError(data.message)
                setLoading(false)
            },
            catcher: (data) => {
                setLoading(false)
            },
        })
    }

    return (
        <Authentication
            footer={
                <p className="text-sm">
                    Already have an account? <LinkButton href="/auth/login" text="Log In →"/>
                </p>
            }>
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex flex-col space-y-4">
                    <div className="pb-6 leading-relaxed flex flex-col space-y-2">
                        <p className="font-bold">Sign Up</p>
                        <p className="text-sm">Create a new account with social networks or with your email and
                            password.</p>
                    </div>

                    {!withEmail && <div>
                        <SocialAuth/>

                        <NoLinkButton text="or Sign Up with Email"
                                      className="block w-full text-center p-3"
                                      onClick={(e) => {
                                          e.preventDefault()
                                          setWithEmail(true)
                                      }}
                                      loading={false}/>
                    </div>}

                    {withEmail && (
                        <>
                            <InputFieldBox value={name}
                                           setValue={setName}
                                           focus
                                           error={errors.name}
                                           name="name"
                                           placeholder="John Doe"
                                           label="Name"/>

                            <InputFieldBox value={email}
                                           setValue={setEmail}
                                           error={errors.email}
                                           type="email"
                                           name="email"
                                           placeholder="john-doe@email.com"
                                           label="Email"/>

                            <InputFieldBox value={password}
                                           setValue={setPassword}
                                           error={errors.password}
                                           type="password"
                                           name="password"
                                           placeholder="Password"
                                           label="Password"/>

                            <InputFieldBox value={passwordConfirmation}
                                           setValue={setPasswordConfirmation}
                                           error={errors.passwordConfirmation}
                                           type="password"
                                           name="password_confirmation"
                                           placeholder="Confirm password"
                                           label="Confirm password"/>

                            <FormErrorMessage error={formError}/>

                            <PrimaryButton text="Sign Up" loading={loading}/>

                            <NoLinkButton className="w-full text-center text-sm pt-4"
                                          text="Back"
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
