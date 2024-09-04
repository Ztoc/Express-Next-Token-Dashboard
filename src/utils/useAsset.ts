import { useWeb3React } from "@src/hooks/useWeb3React";
import { useCallback } from "react";

export const canRegisterToken = () =>
  typeof window !== "undefined" &&
  // @ts-ignore
  !window?.ethereum?.isSafePal &&
  (window?.ethereum?.isMetaMask ||
    window?.ethereum?.isTrust ||
    window?.ethereum?.isCoinbaseWallet ||
    window?.ethereum?.isTokenPocket);

// add asset to wallet
export const useAssetToWallet = () => {
  const { connector, isConnected } = useWeb3React();
  const isCanRegisterToken = canRegisterToken();

  const addAssetToWallet = useCallback(
    (tokenAddress: string, tokenSymbol: string, tokenDecimals: number, image: string) => {
      if (connector && connector.name === "Binance") return null;
      if (!(connector && connector.watchAsset && isConnected)) return null;
      if (!isCanRegisterToken) return null;

      connector.watchAsset?.({
        address: tokenAddress,
        symbol: tokenSymbol.toUpperCase(),
        image,
        // @ts-ignore
        decimals: tokenDecimals,
      });
      return;
    },
    [connector, isCanRegisterToken, isConnected],
  );

  return { isCanRegisterToken, addAssetToWallet };
};
