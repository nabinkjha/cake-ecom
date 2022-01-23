import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";
import { CartProvider } from "../components/cart/context/cartContext";
import { SnackbarProvider } from "notistack";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PaymentProvider } from "../components/cart/context/paymentContext";
function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <CartProvider>
        <PaymentProvider>
          <PayPalScriptProvider deferLoading={true}>
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </PaymentProvider>
      </CartProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
