import { ChainId } from "@pancakeswap/sdk";
import { useMemo } from "react";
import { useAccount, useChainId, useProvider, useSigner } from "wagmi";
import { useWeb3React } from "./useWeb3React";

export const useProviderOrSigner = (
  withSignerIfPossible = true,
  forceBSC?: boolean
) => {
  const { chainId } = useWeb3React();
  const provider = useProvider({ chainId: forceBSC ? ChainId.BSC : chainId });
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();

  return useMemo(
    () =>
      withSignerIfPossible && address && isConnected && signer
        ? signer
        : provider,
    [address, isConnected, provider, signer, withSignerIfPossible]
  );
};
