import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { Store } from "../utils/Store";
import axios from "axios";
import { useRouter } from "next/router";

function Cart() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    console.log("cartItems:", cartItems);

    const updateCartHandler = async (item, quantity) => {
        const res = await axios.get(`/api/product/${item.slug}`);
        console.log("res:", res.data.rows[0]);
        if (res.data.rows[0].countInStock < quantity) {
            window.alert("Sorry, product is out of stock");
            return;
        }
        dispatch({
            type: "CART_ADD_ITEM",
            payload: { ...item, quantity },
        });
    };
    const removeItemHandler = (item) => {
        dispatch({
            type: "CART_REMOVE_ITEM",
            payload: item,
        });
    };

    return (
        <main className={"cart"}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    <h4>Cart is empty</h4>
                    <Link href="/">
                        <a>Go shopping</a>
                    </Link>
                </div>
            ) : (
                <>
                    <div>
                        <div>
                            <h4>Image</h4>
                            <h4>Name</h4>
                            <h4>Quantity</h4>
                            <h4>Price</h4>
                            <h4>Action</h4>
                        </div>
                        {cartItems.map((el) => (
                            <div key={el.id} className={"cart-product"}>
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
                                    <select
                                        name="quantity"
                                        id="quantity"
                                        value={el.quantity}
                                        onChange={(e) =>
                                            updateCartHandler(
                                                el,
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        {[...Array(el.countinstock).keys()].map(
                                            (i) => (
                                                <option
                                                    key={i + 1}
                                                    value={i + 1}
                                                >
                                                    {i + 1}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <p>{el.price} €</p>
                                </div>

                                <button onClick={() => removeItemHandler(el)}>
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div>
                            <h3>Subtotal</h3>
                            <p>
                                ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                                items) :{" "}
                                {cartItems.reduce(
                                    (a, c) => a + c.quantity * c.price,
                                    0
                                )}{" "}
                                €
                            </p>
                        </div>
                        <button onClick={() => router.push("/checkout")}>
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
// "es6": true, in .eslintrc.json rende possibile usare Promise
