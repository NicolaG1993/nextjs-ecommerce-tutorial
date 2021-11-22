import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import { Store } from "../utils/Store";

export default function Payment() {
    const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        cart: { shippingAddress },
    } = state;

    const [paymentMethod, setPaymentMethod] = useState();

    useEffect(() => {
        if (!shippingAddress.address) {
            router.push("/checkout");
        } else {
            setPaymentMethod(Cookies.get("paymentMethod"));
        }
        console.log("paymentMethod:", Cookies.get("paymentMethod"));
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        closeSnackbar();

        if (!paymentMethod) {
            enqueueSnackbar("Payment method is required", { variant: "error" });
        } else {
            dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
            Cookies.set("paymentMethod", paymentMethod);
            router.push("/placeorder");
        }
    };
    const selectionHandler = (e) => {
        setPaymentMethod(e.target.value);
    };

    return (
        <main>
            <CheckoutWizard activeStep={2} />
            <h1>Select the payment method</h1>
            <form onSubmit={submitHandler}>
                <select
                    className={""}
                    onChange={selectionHandler}
                    value={paymentMethod}
                >
                    <option value="pp">Paypal</option>
                    <option value="cc">Credit card</option>
                    <option value="test">Test</option>
                </select>
                <button type="submit">Continue</button>
                <button type="button" onClick={() => router.push("/checkout")}>
                    Go back
                </button>
            </form>
        </main>
    );
}
