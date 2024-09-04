import { getContract } from "@src/utils/contractHelper";
import StakingManagerABI from "../configs/abis/StakingManagerABI.json";
import { useWeb3React } from "./useWeb3React";
import { useSigner } from "wagmi";
import useSWR from "swr";
import { useMemo } from "react";
import { formatBigNumber } from "@src/utils/format";

export const useGetUserInfoFarm = (
  stakingContractAddress: string,
  pid: string | number
) => {
  const { chainId, account } = useWeb3React();
  const { data: signer } = useSigner();

  const stakingContract = getContract(
    stakingContractAddress,
    StakingManagerABI,
    chainId,
    signer
  );

  const { data: userInfo, error } = useSWR(
    [`userinfo ${stakingContractAddress} ${pid}`, account],
    async () => {
      const res = await stakingContract.userInfo(pid, account);
      return res;
    }
  );

  return useMemo(() => {
    if (userInfo) {
      return formatBigNumber(userInfo[0]) || 0;
    }

    return 0;
  }, [userInfo]);
};

export const useGetRewardFarmByPid = (
  stakingContractAddress: string,
  pid: string | number
) => {
  const { chainId, account } = useWeb3React();
  const { data: signer } = useSigner();

  const stakingContract = getContract(
    stakingContractAddress,
    StakingManagerABI,
    chainId,
    signer
  );

  const { data: reward, error } = useSWR(
    [`rewards ${stakingContractAddress} ${pid}`, account],
    async () => {
      const res = await stakingContract.pendingMike(pid, account);
      return res;
    }
  );

  return useMemo(() => {
    if (reward) {
      return formatBigNumber(reward) || 0;
    }
    return 0;
  }, [reward]);
};
