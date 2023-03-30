import InputFieldBox from "../components/form/InputFieldBox"
import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import LinkButton from "../components/buttons/LinkButton"
import {FormEvent, useState} from "react"
import {fetchApi} from "../helpers/ApiFetcher"
import {Tokens} from "../types/Token"
import {DeviceName} from "../storage/DeviceName"
import FormErrorMessage from "../components/form/FormErrorMessage"
import {useNavigate} from "react-router-dom"
import {useAuthState} from "../storage/AuthToken"

export default function Login() {
    const navigate = useNavigate()
    const {setTokens} = useAuthState()
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
                    <div className="flex flex-col space-y-4">
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
                    </div>
                </form>
            </Authentication>
    )
}
