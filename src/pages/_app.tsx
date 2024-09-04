import Providers from "@src/containers/provider";
import type { AppProps } from "next/app";
import { ReactNode } from "react";
import "../styles/global.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <Providers>
      {getLayout(<Component {...pageProps} />)}
    </Providers>
  );
};

export default MyApp;
