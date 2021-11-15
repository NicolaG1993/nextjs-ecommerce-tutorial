import Link from "next/link";
import dynamic from "next/dynamic";

const TotalItemsBadge = dynamic(() => import("./TotalItemsBadge"), {
    ssr: false,
});

export default function Header({ darkMode, darkModeChangeHandler, cart }) {
    return (
        <header>
            <Link href="/">
                <a>
                    <h3>ECommerce</h3>
                </a>
            </Link>

            <div>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={darkModeChangeHandler}
                />
                <Link href="/cart">
                    <a>
                        Cart
                        {cart.cartItems.length > 0 ? (
                            <TotalItemsBadge value={cart.cartItems.length} />
                        ) : null}
                    </a>
                </Link>
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </div>
        </header>
    );
}
