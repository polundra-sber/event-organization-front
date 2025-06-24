import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import "../mocks/browser";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    /* Redux хранилище */
    <Provider store={store}>
      <Component {...pageProps} /> {/* Текущая страница (например, /login) */}
    </Provider>
  );
}

export default MyApp;
