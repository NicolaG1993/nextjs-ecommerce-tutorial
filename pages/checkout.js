import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import {
    addressValidation,
    emailValidation,
    nameValidation,
    numberValidation,
    passwordValidation,
} from "../utils/validateForms";
import dynamic from "next/dynamic";
import CheckoutWizard from "../components/CheckoutWizard";

export default function Checkout() {
    const router = useRouter();
    const { redirect } = router.query;

    const { state, dispatch } = useContext(Store);
    const { userInfo, cart } = state;
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!userInfo) {
            router.push("/login?redirect=/checkout");
        }
        console.log("shippingAddress", shippingAddress);
        if (shippingAddress && Object.keys(shippingAddress).length) {
            setFullName(shippingAddress.fullName);
            setAddress(shippingAddress.address);
            setCity(shippingAddress.city);
            setPostalCode(shippingAddress.postalCode);
            setCountry(shippingAddress.country);
        }
    }, []);

    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [errors, setErrors] = useState({});

    const handleBlur = (e) => {
        console.log("e.target.id: ", e.target.id);
        //estraggo il nome dell'input ed il suo valore
        const { id, name, value } = e.target;
        //creo nuovo oggetto ogni volta per rimuovere errori precedenti
        let newErrObj = { ...errors };

        //validate
        if (id === "Full Name") {
            const resp = nameValidation(id, value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
        if (id === "Address") {
            const resp = addressValidation(id, value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
        if (id === "City") {
            const resp = nameValidation(id, value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
        if (id === "Postal Code") {
            const resp = numberValidation(id, value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
        if (id === "Country") {
            const resp = nameValidation(id, value);
            if (resp) {
                setErrors({ ...errors, [name]: resp });
            } else {
                delete newErrObj[name];
                setErrors(newErrObj);
            }
        }
    };

    const submitHandler = () => {
        dispatch({
            type: "SAVE_SHIPPING_ADRESS",
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country,
            },
        });
        Cookies.set(
            "shippingAddress",
            JSON.stringify({
                fullName,
                address,
                city,
                postalCode,
                country,
            })
        );

        router.push("/payment");
        //devo reindirizzare a payment step
    };

    return (
        <main>
            <CheckoutWizard />
            <h1>Shipping Address</h1>

            <form onSubmit={(e) => submitHandler(e)}>
                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Full Name</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="fullName"
                        id="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.fullName && (
                        <div className={"form-error"}>{errors.fullName}</div>
                    )}
                </div>

                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Address</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="address"
                        id="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.address && (
                        <div className={"form-error"}>{errors.address}</div>
                    )}
                </div>

                <div className={"filter-form-col-left"}>
                    <label>
                        <span>City</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="city"
                        id="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.city && (
                        <div className={"form-error"}>{errors.city}</div>
                    )}
                </div>

                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Postal Code</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="postalCode"
                        id="PostalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.postalCode && (
                        <div className={"form-error"}>{errors.postalCode}</div>
                    )}
                </div>

                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Country</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input
                        type="text"
                        name="country"
                        id="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        onBlur={(e) => handleBlur(e)}
                    />
                    {errors.country && (
                        <div className={"form-error"}>{errors.country}</div>
                    )}
                </div>

                <button type="submit">Continue</button>
            </form>

            <p>
                <Link href={`/?redirect=${redirect || "/"}`}>
                    <a>Go back</a>
                </Link>
            </p>
        </main>
    );
}

//link "Go back" va sistemato, pure il suo reidirect

// export default dynamic(() => Promise.resolve(Checkout), { ssr: false });
