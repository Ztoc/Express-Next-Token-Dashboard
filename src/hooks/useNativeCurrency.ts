import type { NativeCurrency } from "@pancakeswap/sdk";
import { ChainId, Native } from "@pancakeswap/sdk";
import { useMemo } from "react";
import { useWeb3React } from "./useWeb3React";

export default function useNativeCurrency(): NativeCurrency {
  const { chainId } = useWeb3React();
  return useMemo(() => {
    try {
      return Native.onChain(chainId);
    } catch (e) {
      return Native.onChain(ChainId.BSC);
    }
  }, [chainId]);
}
