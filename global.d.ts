import type {Ethereum} from "@wagmi/core";

declare global {
  interface Window {
    BinanceChain?: {
      bnbSign?: (
        address: string,
        message: string
      ) => Promise<{ publicKey: string; signature: string }>;
      switchNetwork?: (networkId: string) => Promise<string>;
    } & Ethereum;
    trustwallet?: Ethereum;
    ethereum?: {
      isSafePal?: boolean;
      isCoin98?: boolean;
    } & Ethereum;
    coin98?: boolean;
  }
}
