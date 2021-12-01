import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SnackbarProvider } from "notistack";
import Layout from "../constants/layout";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";

function MyApp({ Component, pageProps }) {
    return (
        <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <StoreProvider>
                <PayPalScriptProvider deferLoading={true}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </PayPalScriptProvider>
            </StoreProvider>
        </SnackbarProvider>
    );
}

export default MyApp;
