import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect } from "react";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";

export default function Layout({ children }) {
    const { state, dispatch } = useContext(Store);
    const { darkMode, cart, userInfo } = state;

    console.log("userInfo: ", userInfo);

    useEffect(
        () =>
            (document.documentElement.className = darkMode
                ? "darkMode"
                : "lightMode"),
        [darkMode]
    );

    const darkModeChangeHandler = () => {
        dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
        const newDarkMode = !darkMode;
        Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
    };

    // const theme = {};
    return (
        <>
            <Head>
                <title>Ecommerce NextJS Tutorial</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="author" content="NGDesign - Nicola Gaioni" />
                <meta charSet="UTF-8" />
            </Head>

            <Header
                darkMode={darkMode}
                darkModeChangeHandler={darkModeChangeHandler}
                cart={cart}
                userInfo={userInfo || null}
            />
            {children}
            <Footer />
        </>
    );
}
