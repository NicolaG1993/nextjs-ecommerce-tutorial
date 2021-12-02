import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer } from "react";
import { formatJSDate } from "../utils/convertTimestamp";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: false,
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

function OrderHistory() {
    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        orders: [],
        error: "",
    });

    useEffect(() => {
        if (!userInfo) {
            router.push("/login");
        }

        const fetchOrders = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`/api/orders/history`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        fetchOrders();
    }, []);

    console.log("orders:", orders);

    return (
        <main>
            <h1>Order history</h1>

            {loading ? (
                <h3>Loading...</h3>
            ) : error ? (
                <h3>{error}</h3>
            ) : (
                <section className={"order-history-section"}>
                    <div>
                        <h4>ID</h4>
                        <h4>DATE</h4>
                        <h4>TOTAL</h4>
                        <h4>PAID</h4>
                        <h4>DELIVERED</h4>
                        <h4>ACTION</h4>
                    </div>
                    {orders.map((order) => (
                        <div key={order.orderid}>
                            <p>{order.orderid}</p>
                            <p>{formatJSDate(order.createdat)}</p>
                            <p>€ {order.totalprice}</p>
                            <p>
                                {order.ispaid
                                    ? `paid at ${formatJSDate(order.paidat)}`
                                    : "not paid"}
                            </p>
                            <p>
                                {order.isdelivered
                                    ? `delivered at ${formatJSDate(
                                          order.deliveredat
                                      )}`
                                    : "not delivered"}
                            </p>

                            <Link href={`/order/${order.orderid}`}>
                                <a>
                                    <button>Details</button>
                                </a>
                            </Link>
                        </div>
                    ))}
                </section>
            )}
        </main>
    );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
