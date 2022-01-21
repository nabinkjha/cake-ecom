import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import '../styles/globals.css';
import { CartProvider } from '../components/cart/context/cartContext';
//import { StoreProvider } from '../utils/Store';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp
