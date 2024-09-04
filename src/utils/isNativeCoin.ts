import { ChainId } from "@src/configs/web3/chains";

export const ListNativeCoin: any = {
  56: {
    name: "Binance native currency",
    symbol: "BNB",
    chainId: 56,
  },
  97: {
    name: "Binance native currency",
    symbol: "BNB",
    chainId: 97,
  },
};

export const isNativeCoin = (
  token:
    | {
        name?: string;
        symbol: string;
        chainId?: number;
        decimals?: number;
        address?: string;
        logoURI?: string;
      }
    | undefined,
  chainId = ChainId.BSC
): boolean => {
  if (!token) return false;
  const currentNativeCoin = ListNativeCoin[chainId];
  return (
    currentNativeCoin?.symbol?.toLowerCase() === token?.symbol?.toLowerCase() ||
    currentNativeCoin?.symbol?.toLowerCase() === "tbnb" ||
    currentNativeCoin?.address?.toLowerCase() === token?.address?.toLowerCase()
  );
};
