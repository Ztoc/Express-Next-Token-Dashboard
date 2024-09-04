import type { BigNumber } from "@ethersproject/bignumber";
import { useSingleCallResult } from "@src/redux/slices/multicall/hooks";
import { useMulticallContract } from "./useCommonContract";


// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticallContract();
  return useSingleCallResult(multicall, "getCurrentBlockTimestamp")
    ?.result?.[0];
}
