import { useMemo } from "react";
import { getContract } from "./contractHelper";
import { useWeb3React } from "@src/hooks/useWeb3React";
import erc20ABI from "../configs/abis/erc20.json";
import { useAccount, useSigner } from "wagmi";
import useSWR from "swr";
import { formatBigNumber } from "./format";

export const useGetBalanceToken = (tokenAddress: string) => {
  const { chainId } = useWeb3React();
  const { data: signer } = useSigner();
  const { address: account } = useAccount();

  const tokenStakedContract = getContract(
    tokenAddress ,
    erc20ABI,
    chainId,
    signer
  );

  const { data: balance } = useSWR(
    ["getBalance", account, tokenAddress],
    async () => {
      const res = await tokenStakedContract.balanceOf(account);
      return res;
    }
  );

  return useMemo(() => formatBigNumber(balance), [balance]);
};
