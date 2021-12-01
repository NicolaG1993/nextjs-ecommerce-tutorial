import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../utils/Store";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import axios from "axios";
import CheckoutWizard from "../../components/CheckoutWizard";
import Cookies from "js-cookie";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { formatJSDate } from "../../utils/convertTimestamp";

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                order: action.payload,
                error: "",
            };
        case "FETCH_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case "PAY_REQUEST":
            return {
                ...state,
                loadingPay: true,
            };
        case "PAY_SUCCESS":
            return {
                ...state,
                loadingPay: false,
                successPay: true,
            };
        case "PAY_FAIL":
            return {
                ...state,
                loadingPay: false,
                errorPay: action.payload,
            };
        case "PAY_RESET":
            return {
                ...state,
                loadingPay: false,
                successPay: false,
                errorPay: false,
            };
        default:
            state;
    }
}

function Order({ params }) {
    const orderId = Number(params.id);
    const [{ ispending }, paypalDispatch] = usePayPalScriptReducer();
    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const { closeSnackbar, enqueueSnackbar } = useSnackbar();

    const [{ loading, error, order, successPay }, dispatch] = useReducer(
        reducer,
        {
            loading: true,
            order: {},
            error: "",
        }
    );

    const {
        shippingaddress,
        paymentmethod,
        orderitems,
        itemsprice,
        taxprice,
        shippingprice,
        totalprice,
        isdelivered,
        deliveredat,
        ispaid,
        paidat,
    } = order;

    useEffect(() => {
        if (!userInfo) {
            router.push("/login");
        }

        // in questo file fare check di tutte le keys id, orderId, _id
        const fetchOrder = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: "FETCH_SUCCESS", payload: data.rows[0] });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        if (
            !order.orderid ||
            successPay ||
            (order.orderid && order.orderid !== orderId)
        ) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: "PAY_RESET" });
            }
        } else {
            const loadPayPalScript = async () => {
                const { data: clientId } = await axios.get(`/api/keys/paypal`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });

                paypalDispatch({
                    type: "resetOptions",
                    value: { "client-id": clientId, currency: "EUR" },
                });
                paypalDispatch({ type: "setLoadingStatus", value: "pending" });
            };
            loadPayPalScript();
        }
    }, [order, successPay]);

    console.log("order:", order);
    // console.log("shippingaddress:", shippingaddress);

    const createOrder = (data, actions) => {
        console.log("🥶 totalprice:", totalprice);
        return actions.order
            .create({
                purchase_units: [{ amount: { value: totalprice } }],
            })
            .then((orderID) => {
                console.log("🥶 orderID:", orderID);
                return orderID;
            });
    };
    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: "PAY_REQUEST" });
                const { data } = await axios.put(
                    `/api/orders/${order.orderid}/pay`,
                    details,
                    { headers: { authorization: `Bearer ${userInfo.token}` } }
                );
                dispatch({ type: "PAY_SUCCESS", payload: data });
                enqueueSnackbar("Order is paid", { variant: "success" });
                console.log("🥶 PAY_SUCCESS", data);
            } catch (err) {
                dispatch({ type: "PAY_FAIL", payload: getError(err) });
                enqueueSnackbar(getError(err), { variant: "error" });
                console.log("🥶 PAY_FAIL:", getError(err));
            }
        });
    };
    const onCancel = (err) => {
        enqueueSnackbar(getError(err), { variant: "error" });
    };

    return (
        <main>
            <h1>Order details: {orderId}</h1>

            {loading ? (
                <h3>Loading...</h3>
            ) : error ? (
                <h3>{error}</h3>
            ) : (
                <section className={"placeorder-section"}>
                    <div>
                        <div>
                            <h2>Shipping Address</h2>
                            <p>
                                {shippingaddress.fullName},{" "}
                                {shippingaddress.address},{" "}
                                {shippingaddress.city},{" "}
                                {shippingaddress.postalCode},{" "}
                                {shippingaddress.country}
                            </p>
                            <p>
                                Status:{" "}
                                {isdelivered
                                    ? `delivered at ${formatJSDate(
                                          deliveredat
                                      )}`
                                    : `not delivered`}
                            </p>
                        </div>

                        <div>
                            <h2>Payment Method</h2>
                            <p>{paymentmethod}</p>
                            <p>
                                Status:{" "}
                                {ispaid
                                    ? `paid at ${formatJSDate(paidat)}`
                                    : `not paid`}
                            </p>
                        </div>

                        <div>
                            <h2>Order items</h2>
                            <div>
                                <div className={"grid-table-headings"}>
                                    <h4>Image</h4>
                                    <h4>Name</h4>
                                    <h4>Quantity</h4>
                                    <h4>Price</h4>
                                </div>
                                {orderitems.map((el) => (
                                    <div
                                        key={el.itemId}
                                        className={"placeorder-table-product"}
                                    >
                                        <div>
                                            <Link href={`/product/${el.slug}`}>
                                                <a>
                                                    <div>
                                                        <Image
                                                            src={el.image}
                                                            alt={el.name}
                                                            layout="fill"
                                                            objectFit="cover"
                                                        />
                                                    </div>
                                                </a>
                                            </Link>

                                            <Link href={`/product/${el.slug}`}>
                                                <a>
                                                    <h4>{el.name}</h4>
                                                </a>
                                            </Link>

                                            <p>{el.quantity} €</p>
                                            <p>{el.price} €</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={"flex-paragraph"}>
                            <p>Items Price:</p> <p>{itemsprice} €</p>
                        </div>
                        <div className={"flex-paragraph"}>
                            <p>Tax Price:</p> <p>{taxprice} €</p>
                        </div>
                        <div className={"flex-paragraph"}>
                            <p>Shipping Price:</p> <p>{shippingprice} €</p>
                        </div>
                        <div className={"flex-paragraph"}>
                            <h4>Total Price:</h4> <h4>{totalprice} €</h4>
                        </div>

                        {!ispaid && (
                            <div>
                                {ispending ? (
                                    <p>Loading paypal...</p>
                                ) : (
                                    <PayPalButtons
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        onCancel={onCancel}
                                    ></PayPalButtons>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}

export async function getServerSideProps({ params }) {
    return { props: { params } };
}
export default dynamic(() => Promise.resolve(Order), { ssr: false });

//testare nuova table (setup, data types)
//testare db functions
//testare middleware
//testare api endpoint
