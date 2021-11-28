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
        default:
            state;
    }
}

function Order({ params }) {
    const orderId = Number(params.id);
    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: "",
    });

    const {
        shippingaddress,
        paymentmethod,
        orderitems,
        itemsprice,
        taxprice,
        shippingprice,
        totalprice,
        isDelivered,
        deliveredAt,
        isPaid,
        paidAt,
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

        if (!order.orderid || (order.orderid && order.orderid !== orderId)) {
            console.log("🥶order.orderid:", order.orderid);
            console.log("🥶orderId:", orderId);
            fetchOrder();
        }
    }, [order]);

    // const { closeSnackbar, enqueueSnackbar } = useSnackbar();

    console.log("order:", order);
    // console.log("shippingaddress:", shippingaddress);

    return (
        <main>
            <CheckoutWizard activeStep={3} />

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
                                {isDelivered
                                    ? `delivered at ${deliveredAt}`
                                    : `not delivered`}
                            </p>
                        </div>

                        <div>
                            <h2>Payment Method</h2>
                            <p>{paymentmethod}</p>
                            <p>
                                Status:{" "}
                                {isPaid ? `paid at ${paidAt}` : `not paid`}
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
