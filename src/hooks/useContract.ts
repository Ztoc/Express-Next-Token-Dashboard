import { Contract } from "@ethersproject/contracts";
import { getContract } from "@src/utils/contractHelper";
import { useMemo } from "react";
import IPancakePairABI from "../configs/abis/IPancakePair.json";
import { useProviderOrSigner } from "./useProviderOrSigner";
export function useContract<T extends Contract = Contract>(
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true,
  ): T | null {
    const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  
    const canReturnContract = useMemo(() => address && ABI && providerOrSigner, [address, ABI, providerOrSigner])
  
    return useMemo(() => {
      if (!canReturnContract) return null
      try {
        return getContract(address as any, ABI, providerOrSigner as any)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    }, [address, ABI, providerOrSigner, canReturnContract]) as T
  }
  
export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
) {
  return useContract(pairAddress, IPancakePairABI, withSignerIfPossible);
}


