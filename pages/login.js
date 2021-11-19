import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useState } from "react";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

export default function Login() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { redirect } = router.query;
    // redirect é una query che passiamo se vogliamo reindirizzare ad un'altra pagina invece di "home", tipo pag precedente
    // ad es. router.push("/login?redirect=/checkout");
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    if (userInfo) {
        router.push("/");
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [errors, setErrors] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        closeSnackbar();

        try {
            const { data } = await axios.post("/api/users/login", {
                email,
                password,
            });
            dispatch({ type: "USER_LOGIN", payload: data });
            Cookies.set("userInfo", JSON.stringify(data));
            // alert("succesfull Login!");
            router.push(redirect || "/");
        } catch (err) {
            // alert(err.response.data ? err.response.data.message : err.message);
            enqueueSnackbar(
                err.response.data ? err.response.data.message : err.message,
                { variant: "error" }
            );

            //if error show allert
            // console.log("err:", err);
            // setError(err);
            //posso usare useState in alternativa e mostrare degli span vicino a gli inputs
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
                <Link href={`/register?redirect=${redirect || "/"}`}>
                    <a>Register</a>
                </Link>
            </p>
        </main>
    );
}
