import { useWeb3React } from "@src/hooks/useWeb3React";
import MulticallABI from "../configs/abis/Multicall.json";
import { Interface } from "@ethersproject/abi";

import { useContract } from "./useContract";
import { Multicall } from "@src/configs/abis/Multicall";
import { Contract } from "ethers";
import { WNATIVE } from "@pancakeswap/sdk";
import ethAbi from "../configs/abis/weth.json";
import { IPancakeRouter02 } from "@src/configs/abis/IPancakeRouter02";
import erc20 from "../configs/abis/erc20.json";
import routerAbi from "../configs/abis/IPancakeRouter02.json";
import { ROUTER_ADDRESS } from "@src/utils/exchange";
import { useSigner } from "wagmi";

export function useMulticallContract() {
  const ERC20_INTERFACE = new Interface(MulticallABI);

  const { chainId } = useWeb3React();
  return useContract<Multicall>(
    "0xcA11bde05977b3631167028862bE2a173976CA11",
    ERC20_INTERFACE,
    false
  );
}

export function useWNativeContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useWeb3React();
  return useContract<any>(
    chainId ? WNATIVE[chainId]?.address : undefined,
    ethAbi,
    withSignerIfPossible
  );
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
) {
  const { data: signer } = useSigner();

  return tokenAddress && new Contract(tokenAddress ?? "", erc20, signer as any);
}

export function useRouterContract() {
  const { chainId } = useWeb3React();
  const { data: signer } = useSigner();
  return new Contract(ROUTER_ADDRESS[chainId], routerAbi, signer as any);
}
