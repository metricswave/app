import InputFieldBox from "../components/form/InputFieldBox"
import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import LinkButton from "../components/buttons/LinkButton"
import {FormEvent, useState} from "react"
import {fetchApi} from "../helpers/ApiFetcher"
import FormErrorMessage from "../components/form/FormErrorMessage"
import FormSuccessMessage from "../components/form/FormSuccessMessage"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [formSuccess, setFormSuccess] = useState<string | false>(false)
    const [formError, setFormError] = useState<string | false>(false)
    const [errors, setErrors] = useState<{ email: false | string }>({
        email: false,
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

        setErrors({...errors, ...e})

        return !hasErrors
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!isValid()) return

        setLoading(true)
        setFormError(false)

        fetchApi<{ message: string }>("/forgot-password", {
            method: "POST",
            body: {
                email,
            },
            success: (data) => {
                setLoading(false)
                setFormSuccess(data.data.message)
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
                                       focus={true}
                                       setValue={setEmail}
                                       label="Email"
                                       name="email"
                                       placeholder="john-doe@email.com"
                                       type="email"/>

                        <FormErrorMessage error={formError}/>

                        <FormSuccessMessage message={formSuccess}/>

                        <PrimaryButton text="Reset password" loading={loading}/>
                    </div>
                </form>
            </Authentication>
    )
}
