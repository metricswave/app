import InputFieldBox from "../components/form/InputFieldBox"
import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import LinkButton from "../components/buttons/LinkButton"
import {FormEvent, useState} from "react"
import {fetchApi} from "../helpers/ApiFetcher"
import FormErrorMessage from "../components/form/FormErrorMessage"
import {useNavigate, useSearchParams} from "react-router-dom"
import {DeviceName} from "../storage/DeviceName"
import {useAuthState} from "../storage/AuthToken"
import {Tokens} from "../types/Token"

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const {setTokens} = useAuthState()
    const token = searchParams.get("token") || ""
    const email = searchParams.get("email") || ""
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | false>(false)
    const [errors, setErrors] = useState<{ email: false | string, password: false | string, passwordConfirmation: false | string }>({
        email: false,
        password: false,
        passwordConfirmation: false,
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

        if (!isValid()) return

        setLoading(true)
        setFormError(false)

        fetchApi<Tokens>("/reset-password", {
            method: "POST",
            body: {
                email,
                password,
                password_confirmation: passwordConfirmation,
                token,
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
                        Want to login? <LinkButton href="/auth/login" text="Log In →"/>
                    </p>
                    <p className="text-sm">
                        Do not have an account? <LinkButton href="/auth/signup" text="Sign Up →"/>
                    </p>
                </>
            }>
                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="flex flex-col space-y-4">
                        <InputFieldBox value={email}
                                       disabled={true}
                                       setValue={() => null}
                                       label="Email"
                                       name="email"
                                       placeholder="john-doe@email.com"
                                       type="email"/>

                        <InputFieldBox value={password}
                                       focus={true}
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

                        <PrimaryButton text="Update Password" loading={loading}/>
                    </div>
                </form>
            </Authentication>
    )
}
