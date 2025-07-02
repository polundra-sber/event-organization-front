import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import "../mocks/browser";
import { Toaster } from "sonner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    /* Redux хранилище */
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster position="top-center" />
    </Provider>
  );
}

export default MyApp;
