// import { CacheProvider } from "@chakra-ui/next-js";
import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import GlobalHook from "@src/components/GlobalHook";
import { client } from "@src/configs/web3/connectors";
import { Web3Provider } from "@src/configs/web3/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import { SWRConfig } from "swr";
import theme from "../configs/theme/index";
import { Meta } from "./Meta";
import { Provider } from "react-redux";
import { store } from "@src/redux/store";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Meta title="MikeToken" description="Green with Gain" />
      {/* <CacheProvider> */}
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <SWRConfig
            value={{
              refreshInterval: 15000,
            }}
          >
            <Web3Provider client={client}>
              {/* <CSSReset /> */}
              <Provider store={store}>
                <GlobalHook />

                {children}
              </Provider>
            </Web3Provider>
          </SWRConfig>
        </QueryClientProvider>
      </ChakraProvider>
      {/* </CacheProvider> */}
    </>
  );
};
export default Providers;
