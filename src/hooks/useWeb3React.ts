import { CHAIN_IDS, isChainSupported } from "@src/configs/web3/connectors";
import { atom, useAtom } from "jotai";
import * as process from "process";
import { useAccount, useNetwork, useProvider } from "wagmi";


const chainIdLocal = atom<number>(
  Number(process.env.NEXT_PUBLIC_FALLBACK_PUBLIC_CHAIN_ID) || 56
);

export const useChainIdLocal = () => {
  return useAtom(chainIdLocal);
};

// ChainId[]
export function useWeb3React() {
  const [fallbackChain] = useChainIdLocal();
  // public chain id for not connected state
  const { chain } = useNetwork();
  const { address, connector, isConnected, isConnecting } = useAccount();
  const isSupportedChain = chain && isChainSupported(chain?.id, CHAIN_IDS);
  const provider = useProvider({ chainId: chain?.id || fallbackChain });

  return {
    provider,
    // fallback default chain when not connect wallet
    chainId: isSupportedChain ? chain?.id : fallbackChain,
    account: address as string,
    isConnected,
    isConnecting,
    chain,
    isSupportedChain,
    connector,
  };
}
