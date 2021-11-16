import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { Store } from "../../utils/Store";
// import data from "../../utils/data";

export default function Product({ product }) {
    // const router = useRouter();
    // const { slug } = router.query;
    // const [product, setProduct] = useState();
    // useEffect(
    //     () =>
    //         axios
    //             .get(`/api/product/${slug}`)
    //             .then((res) => setProduct(res.data.rows[0])),
    //     [slug]
    // );

    const { state, dispatch } = useContext(Store);

    const existItem = state.cart.cartItems.find((x) => x.id === product.id);

    const addToCartHandler = async () => {
        const res = await axios.get(`/api/product/${product.slug}`);
        console.log("res:", res.data.rows[0]);
        if (res.data.rows[0].countInStock <= 0) {
            window.alert("Sorry, product is out of stock");
            return;
        }
        dispatch({
            type: "CART_ADD_ITEM",
            payload: { ...product, quantity: 1 },
        });
    };

    const updateCartHandler = async (quantity) => {
        const res = await axios.get(`/api/product/${product.slug}`);
        console.log("res:", res.data.rows[0]);
        if (res.data.rows[0].countInStock < quantity) {
            window.alert("Sorry, product is out of stock");
            return;
        }
        dispatch({
            type: "CART_ADD_ITEM",
            payload: { ...product, quantity },
        });
    };

    const removeFromCartHandler = () => {
        dispatch({
            type: "CART_REMOVE_ITEM",
            payload: product,
        });
    };

    return (
        <main>
            {product ? (
                <section className={"product-section"}>
                    <div>
                        <Image
                            src={product.image}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>

                    <div>
                        <div>
                            <h1> {product.name}</h1>

                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <p>Brand: {product.brand}</p>
                            <p>
                                Rating: ⭐{product.rating} ({product.numReviews}{" "}
                                reviews)
                            </p>
                        </div>
                        <div>
                            <h4>Price: {product.price} €</h4>
                            <p>Status: {product.countInStock} in stock</p>
                            {existItem ? (
                                <div>
                                    <p>Quantity</p>
                                    <select
                                        name="quantity"
                                        id="quantity"
                                        value={existItem.quantity}
                                        onChange={(e) =>
                                            updateCartHandler(
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        {[
                                            ...Array(
                                                product.countinstock
                                            ).keys(),
                                        ].map((i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button onClick={removeFromCartHandler}>
                                        REMOVE FROM CART
                                    </button>
                                </div>
                            ) : (
                                <button onClick={addToCartHandler}>
                                    ADD TO CART
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            ) : (
                <div>
                    <h2>Can`t find this product!</h2>
                </div>
            )}
        </main>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;

    const response = await axios.get(
        `http://localhost:3000/api/product/${slug}`
    ); //solo per local

    return {
        props: { product: response.data.rows[0] },
    };
}
