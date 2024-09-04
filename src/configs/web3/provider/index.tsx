import type { Provider, WebSocketProvider } from "@wagmi/core";
import type { WagmiConfigProps } from "wagmi";
import { WagmiConfig } from "wagmi";

export function Web3Provider<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider
>(
  props: React.PropsWithChildren<
    WagmiConfigProps<TProvider, TWebSocketProvider>
  >
) {
  return <WagmiConfig client={props.client}>{props.children}</WagmiConfig>;
}
