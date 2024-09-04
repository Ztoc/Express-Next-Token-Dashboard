import { BLOCKS_PER_YEAR } from "@src/redux/slices/swap/fetch/constants";
import BigNumber from "bignumber.js";


export const getFarmApr = (
  poolWeight: BigNumber,
  rewardPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  rewardPerBlock: BigNumber,
): { apr: number | null; yearlyRewardAllocation: string } => {
  // @ts-ignore
  const yearlyCakeRewardAllocation = BigNumber(rewardPerBlock)
    .times(BLOCKS_PER_YEAR)
    .times(poolWeight);
  const apy = yearlyCakeRewardAllocation
    .times(100)
    .times(rewardPriceUsd)
    .div(poolLiquidityUsd)
    // .div(1000)
    // .times(100);

  return {
    apr: apy.isNaN() || !apy.isFinite() ? null : apy.toNumber(),
    yearlyRewardAllocation: yearlyCakeRewardAllocation.toJSON(),
  };
};
