import InputFieldBox from "../components/form/InputFieldBox"
import PrimaryButton from "../components/form/PrimaryButton"
import Authentication from "../components/wrappers/Authentication"
import LinkButton from "../components/buttons/LinkButton"
import {useState} from "react"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
            <Authentication footer={
                <p className="mt-10 text-sm">
                    Do not have an account? <LinkButton href="/auth/signup" text="Sign Up →"/>
                </p>
            }>
                <form className="mt-8">
                    <div className="flex flex-col space-y-4">
                        <InputFieldBox value={email}
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

                        <PrimaryButton text="Log In"/>
                    </div>
                </form>
            </Authentication>
    )
}
