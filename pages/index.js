import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Store } from "../utils/Store";
// import data from "../utils/data";

export default function Home(props) {
    // console.log("props", props);

    const { dispatch } = useContext(Store);
    const addToCartHandler = async (slug) => {
        const res = await axios.get(`/api/product/${slug}`);
        console.log("res:", res.data.rows[0]);
        if (res.data.rows[0].countInStock <= 0) {
            window.alert("Sorry, product is out of stock");
            return;
        }
        dispatch({
            type: "CART_ADD_ITEM",
            payload: { ...res.data.rows[0], quantity: 1 },
        });
    };

    return (
        <main>
            <h1>Products</h1>
            <section className={"home-grid"}>
                {props.products &&
                    props.products.map((el) => (
                        <div key={el.name}>
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

                                    <div>
                                        <div>
                                            <h4>{el.name}</h4>
                                            <p>{el.price} €</p>
                                        </div>
                                    </div>
                                </a>
                            </Link>

                            <button onClick={() => addToCartHandler(el.slug)}>
                                Add to cart
                            </button>
                        </div>
                    ))}
            </section>
        </main>
    );
}

export async function getServerSideProps() {
    const response = await axios.get("http://localhost:3000/api/hello");
    //getServerSideProps runs on build time, it does not receive data that’s only available during request time, such as query parameters or HTTP headers as it generates static HTML
    //per il deploy dovró renderlo dinamico in base al host dell'API, localhost funziona solo local
    // console.log("response", response);
    return {
        props: { products: response.data.rows },
    };
}
