import contracts from "@src/constants/contracts";
import { formatBnFromContractToString } from "@src/utils/format";
import { multicallv2, multicallv3 } from "@src/utils/multicall";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import useSWR from "swr";
import stakingAbi from "../configs/abis/stakingContract.json";
import { useMKTPrice } from "./useBUSDPrice";
import { useWeb3React } from "./useWeb3React";
import { BIG_TEN, BIG_ZERO } from "@src/redux/slices/swap/fetch/constants";
import { getFarmApr } from "@src/utils/getApr";
import mktPoolAbi from "../configs/abis/mktPool.json";
import stakingManergerAbi from "../configs/abis/StakingManagerABI.json";
export const useUsdtPoolData = () => {
  const { chainId } = useWeb3React();
  const calls = [
    {
      address: (contracts.gloryPool as any)[chainId] as any,
      name: "totalStaked",
      params: [],
    },
    {
      address: (contracts.gloryPool as any)[chainId] as any,
      name: "rewardRate",
      params: [],
    },
  ];

  const { data: results } = useSWR(
    ["public-pool-data", (contracts.gloryPool as any)[chainId], chainId],
    async () => {
      const res = await multicallv2({
        abi: stakingAbi,
        calls,
        chainId,
      }).catch((err) => console.error("err >> ", err));
      
      return res;
    }
  );

  // const gloryPrice = useTokenPrice(getAddress(contracts.glory, chainId));
  const price = useMKTPrice()?.toFixed();
  const tokenPrice = Number(price) * 240;
  return useMemo(() => {
    if (results?.length) {
      const resTotalStaked = results[0];
      const resRewardRate = results[1];
      const { result: totalStaked } = resTotalStaked || {};
      const { result: rewardRate } = resRewardRate || {};

      const realRewardRate = formatBnFromContractToString(rewardRate || 0);
      const realTotalStaked = formatBnFromContractToString(totalStaked || 0);

      const yearlyRewardAllocation = BigNumber(realRewardRate)
        .times(3)
        .times(10512000);
      const apr = yearlyRewardAllocation
        .div(BigNumber(realTotalStaked || 1).times(tokenPrice))
        .times(100)
        .toFixed(2, BigNumber.ROUND_DOWN);

      return {
        totalStaked: realTotalStaked,
        apr,
      };
    }
    return {
      totalStaked: "0",
      apr: "0",
    };
  }, [results, tokenPrice]);
};

export const usePublicData = (pid: number): any => {
  const { chainId } = useWeb3React();
  const calls = [
    {
      address: (contracts.farmStakingContract as any)[chainId] as any,
      name: "poolInfo",
      params: [pid],
    },
    {
      address: (contracts.farmStakingContract as any)[chainId] as any,
      name: "totalAllocPoint",
      params: [],
    },

    {
      address: (contracts.farmStakingContract as any)[chainId] as any,
      name: "mikePerBlock",
      params: [],
    },
  ];

  const { data: results } = useSWR(
    ["public-data", (contracts.stakingContract as any)[chainId], chainId, pid],
    async () => {
      const res = await multicallv2({
        abi: stakingManergerAbi,
        calls,
        chainId,
      }).catch((err) => console.error("err >> ", err));
      return res;
    }
  );
  return results;
};

export const useApr = (publicData: any, totalStake?: number) => {
  const tokenPrice = useMKTPrice();

  if (!publicData || !totalStake) {
    return null;
  }
  const mktprice = Number(tokenPrice) ? tokenPrice : 0.000000000364;
  const [info, totalRegularAllocPoint, rewardPerBlock] = publicData;
  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const poolWeight = totalRegularAllocPoint
    ? allocPoint.div(new BigNumber(totalRegularAllocPoint))
    : new BigNumber(1);
  // const poolWeight = new BigNumber(1);
  const rewardPerBlockNumber = new BigNumber(rewardPerBlock).div(
    BIG_TEN.pow(18)
  );
  const liquidity = Number(totalStake) * Number(mktprice);
  const apr = getFarmApr(
    poolWeight,
    BigNumber(mktprice),
    BigNumber(liquidity),
    rewardPerBlockNumber
  );
  return apr;
};

export const useMKTPoolData = () => {
  const { chainId } = useWeb3React();

  const calls = [
    {
      address: (contracts.monsterPool as any)[chainId] as any,
      name: "totalStaked",
      params: [],
    },
    {
      address: (contracts.monsterPool as any)[chainId] as any,
      name: "rewardRate",
      params: [],
    },
  ];

  const { data: results } = useSWR(
    ["public-data", (contracts.monsterPool as any)[chainId], chainId],
    async () => {
      const res = await multicallv2({
        abi: mktPoolAbi,
        calls,
        chainId,
      }).catch((err) => console.error("err >> ", err));
      return res;
    }
  );
  const tokenPrice = useMKTPrice();
  const mktPrice = Number(tokenPrice) ? tokenPrice : 0.000000000364;

  return useMemo(() => {
    if (results?.length) {
      const resTotalStaked = results[0];
      const resRewardRate = results[1];
      const totalStaked = resTotalStaked || {};
      const rewardRate = resRewardRate || {};
      const realRewardRate = formatBnFromContractToString(rewardRate || 0);
      const realTotalStaked = formatBnFromContractToString(totalStaked || 0);

      const yearlyRewardAllocation = BigNumber(realRewardRate)
        .times(3)
        .times(10512000);

      const apr = yearlyRewardAllocation
        .div(BigNumber(realTotalStaked || 1).times(mktPrice))
        .times(100)
        .toFixed(2, BigNumber.ROUND_DOWN);

      return {
        totalStaked: realTotalStaked,
        apr,
      };
    }
    return {
      totalStaked: "0",
      apr: "0",
    };
  }, [results, mktPrice]);
};
