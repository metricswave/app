import InputFieldBox from "../components/form/InputFieldBox"
import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import LinkButton from "../components/buttons/LinkButton"
import {useState} from "react"

export default function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    // const formValues = {name, email, password, passwordConfirmation}

    return (
            <Authentication
                    footer={
                        <p className="mt-10 text-sm">
                            Already have an account? <LinkButton href="/auth/login" text="Log In →"/>
                        </p>
                    }>
                <form className="mt-8">
                    <div className="flex flex-col space-y-4">
                        <InputFieldBox value={name}
                                       setValue={setName}
                                       name="name"
                                       placeholder="John Doe"
                                       label="Name"/>

                        <InputFieldBox value={email}
                                       setValue={setEmail}
                                       type="email"
                                       name="email"
                                       placeholder="john-doe@email.com"
                                       label="Email"/>

                        <InputFieldBox value={password}
                                       setValue={setPassword}
                                       type="password"
                                       name="password"
                                       placeholder="Password"
                                       label="Password"/>

                        <InputFieldBox value={passwordConfirmation}
                                       setValue={setPasswordConfirmation}
                                       type="password"
                                       name="password_confirmation"
                                       placeholder="Confirm password"
                                       label="Confirm password"/>

                        <PrimaryButton text="Sign Up"/>
                    </div>
                </form>
            </Authentication>
    )
}
