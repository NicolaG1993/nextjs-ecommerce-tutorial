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
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </StoreProvider>
        </SnackbarProvider>
    );
}

export default MyApp;
