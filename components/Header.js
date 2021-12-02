import Link from "next/link";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

const TotalItemsBadge = dynamic(() => import("./TotalItemsBadge"), {
    ssr: false,
});

export default function Header({
    darkMode,
    darkModeChangeHandler,
    cart,
    userInfo,
}) {
    const router = useRouter();
    const { dispatch } = useContext(Store);
    const [anchorEl, setAnchorElement] = useState(false);
    const dropMenuOpen = () => {
        setAnchorElement(!anchorEl);
    };
    const dropMenuClose = () => {
        setAnchorElement(false);
    };
    const logoutClickHandler = () => {
        setAnchorElement(false);
        dispatch({ type: "USER_LOGOUT" });
        Cookies.remove("userInfo");
        Cookies.remove("cartItems");
        router.push("/");
    };

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
                {userInfo ? (
                    <>
                        <span className={"navbarBtn"} onClick={dropMenuOpen}>
                            {userInfo.name}
                        </span>
                        {anchorEl && (
                            <div className={"navbarDropMenu"}>
                                <Link href="/profile">
                                    <a onClick={dropMenuClose}>Profile</a>
                                </Link>
                                <Link href="/order-history">
                                    <a onClick={dropMenuClose}>Order History</a>
                                </Link>
                                <Link href="/login">
                                    <a onClick={logoutClickHandler}>Logout</a>
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                )}
            </div>
        </header>
    );
}
