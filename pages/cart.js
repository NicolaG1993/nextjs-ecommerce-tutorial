import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { Store } from "../utils/Store";

export default function Cart() {
    const { state } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    console.log("cart:", cartItems);

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
                            <Link href={`/product/${el.slug}`}>
                                <a>
                                    <div>
                                        <div>
                                            <Image
                                                src={el.image}
                                                alt={el.name}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <h4>{el.name}</h4>
                                        <p>{el.quantity}</p>
                                        <p>{el.price} €</p>
                                    </div>
                                </a>
                            </Link>
                            <button>X</button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
