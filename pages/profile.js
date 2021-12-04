import Link from "next/link";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import {
    emailValidation,
    nameValidation,
    passwordValidation,
} from "../utils/validateForms";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";

function Profile() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);

    const { userInfo } = state;
    console.log("userInfo: ", userInfo);

    useEffect(() => {
        if (!userInfo) {
            return router.push("/login");
        }
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [pswConfirmationError, setPswConfirmationError] = useState(false);

    const handleBlur = (e) => {
        console.log("e.target.id: ", e.target.id);
        console.log("e.target.value: ", e.target.value);
        //estraggo il nome dell'input ed il suo valore
        const { id, name, value } = e.target;
        //creo nuovo oggetto ogni volta per rimuovere errori precedenti
        let newErrObj = { ...errors };

        delete newErrObj[name];
        setErrors(newErrObj);

        //validate
        if (value !== "") {
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
                const { data } = await axios.put(
                    "/api/users/profile",
                    {
                        id: userInfo.id,
                        name,
                        email,
                        password,
                    },
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({ type: "USER_REGISTER", payload: data });
                Cookies.set("userInfo", JSON.stringify(data));
                // alert("succesfull Registration!");
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
            <h1>Profile</h1>

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

                <button type="submit">Update profile</button>
            </form>

            <section>
                <h3>ID: {userInfo.id}</h3>
                <h3>Name: {userInfo.name}</h3>
                <h3>Email: {userInfo.email}</h3>
                <h3>Pic: {userInfo.profile_pic_url}</h3>
            </section>
        </main>
    );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });

//il bluerhandler si deve attivare solo se ho inserito qualche valore nell'input
// probabilmente faccio il check dei valori da passare a db in api
// devo inoltre chiedere la vecchia password per aggiornare quella nuova (opzionale)
// devo fare vedere le info attuali
