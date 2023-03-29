import InputFieldBox from "../components/form/InputFieldBox"
import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import LinkButton from "../components/buttons/LinkButton"
import {FormEvent, useState} from "react"
import {DeviceName} from "../storage/DeviceName"

export default function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | false>(false)
    const [errors, setErrors] = useState<{ name: false | string, email: false | string, password: false | string, passwordConfirmation: false | string }>({
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

        if (password !== passwordConfirmation) {
            hasErrors = true
            e = {...e, passwordConfirmation: "Passwords do not match"}
        } else {
            e = {...e, passwordConfirmation: false}
        }

        setErrors({...errors, ...e})

        return !hasErrors
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!isValid()) return

        setLoading(true)
        setFormError(false)

        fetch("http://notifywave.test/api/signup", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                device_name: DeviceName.name(),
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
                .then(async res => {
                    if (res.status >= 200 && res.status < 300) {
                        return res.json()
                    }

                    const e = await res.json()
                    throw new Error(e.message)
                })
                .then(data => {
                    localStorage.setItem("nw:auth", JSON.stringify(data.data))
                    window.location.href = "/"
                    setLoading(false)
                })
                .catch(err => {
                    setFormError(err.message)
                    setLoading(false)
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
                        <InputFieldBox value={name}
                                       setValue={setName}
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

                        {formError && <p className="text-red-500 text-sm py-2 text-center">{formError}</p>}

                        <PrimaryButton text="Sign Up" loading={loading}/>
                    </div>
                </form>
            </Authentication>
    )
}
