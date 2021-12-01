import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import CheckoutWizard from "../components/CheckoutWizard";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import axios from "axios";
import Cookies from "js-cookie";

function PlaceOrder() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);

    const {
        userInfo,
        cart: { cartItems, shippingAddress, paymentMethod },
    } = state;
    // console.log("cartItems:", cartItems);
    // console.log("shippingAddress:", shippingAddress);

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
    const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
    );
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    let orderItems = [];
    cartItems.map((el) => {
        orderItems.push({
            itemId: el.id,
            name: el.name,
            price: el.price,
            quantity: el.quantity,
            image: el.image,
            slug: el.slug,
        });
    });

    useEffect(() => {
        if (!paymentMethod) {
            router.push("/payment");
        }
        if (cartItems.length === 0) {
            router.push("/cart");
        }
    }, []);

    const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const placeOrderHandler = async () => {
        closeSnackbar();

        try {
            setLoading(true);
            const { data } = await axios.post(
                "/api/orders",
                {
                    userId: userInfo.id,
                    orderItems: JSON.stringify(orderItems),
                    shippingAddress,
                    paymentMethod,
                    paymentResult: null,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );
            dispatch({ type: "CART_CLEAR" });
            Cookies.remove("cartItems");
            setLoading(false);
            router.push(`/order/${data.orderid}`);
            //dovrei settare id random invece di numeri seriali
        } catch (err) {
            setLoading(false);
            enqueueSnackbar(getError(err), { variant: "error" });
        }
    };

    return (
        <main>
            <CheckoutWizard activeStep={3} />

            <h1>Your order</h1>

            <section className={"placeorder-section"}>
                <div>
                    <div>
                        <h2>Shipping Address</h2>
                        <p>
                            {shippingAddress.fullName},{" "}
                            {shippingAddress.address}, {shippingAddress.city},{" "}
                            {shippingAddress.postalCode},{" "}
                            {shippingAddress.country}
                        </p>
                    </div>

                    <div>
                        <h2>Payment Method</h2>
                        <p>{paymentMethod}</p>
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
                            {cartItems.map((el) => (
                                <div
                                    key={el.id}
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
                        <p>Items Price:</p> <p>{itemsPrice} €</p>
                    </div>
                    <div className={"flex-paragraph"}>
                        <p>Tax Price:</p> <p>{taxPrice} €</p>
                    </div>
                    <div className={"flex-paragraph"}>
                        <p>Shipping Price:</p> <p>{shippingPrice} €</p>
                    </div>
                    <div className={"flex-paragraph"}>
                        <h4>Total Price:</h4> <h4>{totalPrice} €</h4>
                    </div>

                    <button onClick={placeOrderHandler}>Place order</button>
                    <button
                        type="button"
                        onClick={() => router.push("/payment")}
                    >
                        Go back
                    </button>
                    {loading && <h4>Loading...</h4>}
                </div>
            </section>
        </main>
    );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });

//testare nuova table (setup, data types)
//testare db functions
//testare middleware
//testare api endpoint
