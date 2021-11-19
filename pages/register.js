import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useState } from "react";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import {
    emailValidation,
    nameValidation,
    passwordValidation,
} from "../utils/validateForms";

export default function Register() {
    const router = useRouter();
    const { redirect } = router.query;

    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    if (userInfo) {
        router.push("/");
    }

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [pswConfirmationError, setPswConfirmationError] = useState(false);

    const handleBlur = (e) => {
        console.log("e.target.id: ", e.target.id);
        //estraggo il nome dell'input ed il suo valore
        const { id, name, value } = e.target;
        //creo nuovo oggetto ogni volta per rimuovere errori precedenti
        let newErrObj = { ...errors };

        //validate
        if (id === "Name") {
            const resp = nameValidation("Name", value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
        if (id === "Email") {
            const resp = emailValidation(value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
        if (id === "Password") {
            const resp = passwordValidation(value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
    };

    const submitHandler = async (e) => {
        setPswConfirmationError(false);

        e.preventDefault();

        if (Object.keys(errors).length === 0) {
            if (password !== confirmPassword) {
                // alert("The password doesnt match!");
                setPswConfirmationError("The password doesnt match!");
                return;
            }

            try {
                const { data } = await axios.post("/api/users/register", {
                    name,
                    email,
                    password,
                });
                dispatch({ type: "USER_REGISTER", payload: data });
                Cookies.set("userInfo", JSON.stringify(data));
                // alert("succesfull Registration!");
                router.push(redirect || "/");
            } catch (err) {
                console.log("error:", err);
                alert(
                    err.response.data ? err.response.data.message : err.message
                );
                //if error show allert
            }
        } else {
            console.log("INVALID INPUTS", errors);
            return;
        }
    };

    return (
        <main>
            <h1>Register</h1>

            <form onSubmit={(e) => submitHandler(e)}>
                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Name</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="name"
                        id="Name"
                        onChange={(e) => setName(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.name && (
                        <div className={"form-error"}>{errors.name}</div>
                    )}
                </div>

                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Email</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="email"
                        id="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.email && (
                        <div className={"form-error"}>{errors.email}</div>
                    )}
                </div>

                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Password</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="password"
                        name="password"
                        id="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.password && (
                        <div className={"form-error"}>{errors.password}</div>
                    )}
                </div>

                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Confirm Password</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {pswConfirmationError && (
                        <div className={"form-error"}>
                            {pswConfirmationError}
                        </div>
                    )}
                </div>

                <button type="submit">Register</button>
            </form>

            <p>
                Already have an account?{" "}
                <Link href={`/login?redirect=${redirect || "/"}`}>
                    <a>Login</a>
                </Link>
            </p>
        </main>
    );
}
