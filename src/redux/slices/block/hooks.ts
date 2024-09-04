// eslint-disable-next-line camelcase
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useProvider } from "wagmi";

import { FAST_INTERVAL, SLOW_INTERVAL } from "@src/constants";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { queryClient } from "@src/containers/provider";
// eslint-disable-next-line import/no-cycle

const REFRESH_BLOCK_INTERVAL = 3000;

let isInit = false;
let initBlock = 0;
let cacheBlock = 0;
let chainID = 0;
export const usePollBlockNumber = () => {
  const { chainId, provider } = useWeb3React();

  const callFirstTime = useCallback(
    async (chainIdRaw: any) => {
      if (chainIdRaw) {
        if (!isInit) {
          isInit = true;
          const blockNumber = await provider.getBlockNumber();
          initBlock = blockNumber;
          cacheBlock = blockNumber;
          queryClient.setQueryData(["blockNumber", chainIdRaw], blockNumber);
        }
      }
    },
    [chainId, queryClient, provider]
  );

  useEffect(() => {
    callFirstTime(chainId);
  }, [chainId, provider]);

  const { data } = useQuery(
    chainId && ["blockNumber", chainId] || [],
    async () => {
      const lastBlockNumber: number = queryClient.getQueryData([
        "blockNumber",
        chainId,
      ]) as number;

      if (
        chainID === 0 ||
        (chainID !== chainId && lastBlockNumber - cacheBlock > 10)
      ) {
        const blockNumber = await provider.getBlockNumber();
        if (
          typeof queryClient.getQueryData(["initialBlockNumber", chainId]) ===
          "undefined"
        ) {
          queryClient.setQueryData(
            ["initialBlockNumber", chainId],
            blockNumber
          );
        }
        cacheBlock = blockNumber;
        initBlock = blockNumber;
        chainID = chainId;
        return blockNumber;
      }
      initBlock += 1;
      return initBlock;
    },
    {
      refetchInterval: REFRESH_BLOCK_INTERVAL,
      initialData: 0,
      retryOnMount: true,
    }
  );

  useQuery(
    chainId && [FAST_INTERVAL, "blockNumber", chainId] || [],
    async () => {
      return data;
    },
    {
      refetchInterval: FAST_INTERVAL,
    }
  );

  useQuery(
    chainId && [SLOW_INTERVAL, "blockNumber", chainId] || [],
    async () => {
      return data;
    },
    {
      refetchInterval: SLOW_INTERVAL,
    }
  );
};

export const useCurrentBlock = (): number => {
  const { chainId } = useWeb3React();
  return queryClient.getQueryData(["blockNumber", chainId]) || 0;
};

export const useChainCurrentBlock = (chainId: number): number => {
  const { chainId: activeChainId } = useWeb3React();
  const provider = useProvider({ chainId });
  const { data: currentBlock = 0 } = useQuery(
    // eslint-disable-next-line no-nested-ternary
    chainId
      ? activeChainId === chainId
        ? ["blockNumber", chainId]
        : ["chainBlockNumber", chainId]
      : [],
    activeChainId !== chainId
      ? async () => {
          return provider.getBlockNumber();
        }
      : undefined as any,
    activeChainId !== chainId
      ? {
          refetchInterval: REFRESH_BLOCK_INTERVAL,
        }
      : undefined
  );
  return currentBlock as number;
};

export const useInitialBlock = (): number => {
  const { chainId } = useWeb3React();
  return queryClient.getQueryData(["initialBlockNumber", chainId]) || 0;
};
