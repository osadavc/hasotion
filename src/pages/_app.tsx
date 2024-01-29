import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Hasotion</title>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </Head>

      <Component {...pageProps} />
      <Toaster />
    </>
  );
};

export default App;
