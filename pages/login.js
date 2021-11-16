import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/users/login", {
                email,
                password,
            });
            alert("succesfull Login!");
            //save users data from db into cookies
            //redirect to home logged in
        } catch (err) {
            alert(err.response.data ? err.response.data.message : err.message);
            //if error show allert
        }
    };

    return (
        <main>
            <h1>Login</h1>

            <form onSubmit={(e) => submitHandler(e)}>
                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Email</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Enter</button>
            </form>

            <p>
                Don't have an account?{" "}
                <Link href="/join">
                    <a>Register</a>
                </Link>
            </p>
        </main>
    );
}
