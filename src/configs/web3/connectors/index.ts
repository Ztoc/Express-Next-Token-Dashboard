import { publicProvider } from "@wagmi/core/providers/public";
import memoize from "lodash/memoize";
import { configureChains, createClient } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import type { ChainId } from "../chains";
import { bsc, bscTest } from "../chains";
import { BinanceWalletConnector } from "./binanceWallet";
import { TrustWalletConnector } from "./trustWallet";

const CHAINS = [bsc, bscTest];

export const { provider, chains } = configureChains(CHAINS, [publicProvider()]);

export const injectedConnector = new InjectedConnector({
  options: {
    shimDisconnect: true,
    name: "Trust Wallet",
    getProvider: () =>
      typeof window !== "undefined" ? (window as any).trustwallet : undefined,
  },
});
export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: "Mike meme",
    appLogoUrl: "",
  },
});

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: "6a0ccae61d07e24d141067ab90e103e7",
    showQrModal: true,
  },
});

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
    // shimChainChangedDisconnect: true,
  },
});

export const bscConnector = new BinanceWalletConnector({ chains });

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});
export const client = createClient({
  autoConnect: false,
  provider,
  connectors: [
    // new SafeConnector({ chains }),
    metaMaskConnector,
    trustWalletConnector,
    // bitKeepWalletConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    bscConnector,
  ],
});
export const CHAIN_IDS = chains.map((c) => c.id);

export const isChainSupported = memoize(
  (chainId: number, chainsIds?: ChainId[]) =>
    (chainsIds || CHAIN_IDS).includes(Number(chainId)),
  (chainId: number, chainsIds?: ChainId[]) =>
    `${chainId}-${(chainsIds || CHAIN_IDS).map((c) => c).join("-")}`
);
export const isChainTestnet = memoize(
  (chainId: number) => chains.find((c) => c.id === chainId)?.testnet
);
