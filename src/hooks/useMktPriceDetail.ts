import contracts from "@src/constants/contracts";
import { multicallv2 } from "@src/utils/multicall";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import useSWR from "swr";
import stakingAbi from "../configs/abis/stakingContract.json";
import { useWeb3React } from "./useWeb3React";

export const useMKTPriceDetail = (stakingContractAddress:any) => {
  const { chainId } = useWeb3React();
  const calls = [
    {
      address: stakingContractAddress,
      name: "getMktPrice",
      params: [],
    },
    {
      address: stakingContractAddress,
      name: "getMktPercentage",
      params: [],
    },
  ];
  const { data: results } = useSWR(
    ["mkt-price-detail", (contracts.gloryPool as any)[chainId], chainId],
    async () => {
      const res = await multicallv2({
        abi: stakingAbi,
        calls,
        chainId,
      }).catch((err) => console.error("err >> ", err));
      return res;
    }
  );
  return useMemo(() => {
    if (results?.length > 0) {
      const priceDetail = results[0];
      const mktPercentage = results[1];
      const price = new BigNumber(priceDetail[0]?._hex);
      const basisPrice = new BigNumber(priceDetail[1]?._hex);
      return {
        mktPrice: price?.div(basisPrice).toNumber(),
        mktPercentage: new BigNumber(mktPercentage[0]?._hex)?.toNumber(),
      };
    }
  }, [results]);
};
