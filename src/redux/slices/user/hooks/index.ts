import { ChainId, ERC20Token, Pair } from "@pancakeswap/sdk";
import { SerializedWrappedToken, deserializeToken } from "@pancakeswap/token-lists";
import { useQuery } from "@tanstack/react-query";
import { flatMap } from "lodash";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useFeeData } from "wagmi";

import { getFarmConfig } from "@src/constants/liquidity";
import { useOfficialsAndUserAddedTokens } from "@src/hooks/Tokens";
import { useWeb3React } from "@src/hooks/useWeb3React";
import type { AppState } from "@src/redux/store";
import { useAppDispatch } from "@src/redux/store";
import { GAS_PRICE_GWEI } from "@src/redux/types";
import {
  BASES_TO_TRACK_LIQUIDITY_FOR,
  PINNED_PAIRS,
} from "@src/utils/exchange";

import type { ChartViewMode } from "../actions";
import {
  setChartViewMode,
  setIsExchangeChartDisplayed,
  setZapDisabled,
  updateGasPrice,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
} from "../actions";
import { isAddress } from "@src/utils/common";

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState["user"]["userExpertMode"]>(
    (state) => state.user.userExpertMode
  );
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }));
  }, [expertMode, dispatch]);

  return [expertMode, toggleSetExpertMode];
}

export function useUserSingleHopOnly(): [
  boolean,
  (newSingleHopOnly: boolean) => void
] {
  const dispatch = useAppDispatch();

  const singleHopOnly = useSelector<
    AppState,
    AppState["user"]["userSingleHopOnly"]
  >((state) => state.user.userSingleHopOnly);

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(
        updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly })
      );
    },
    [dispatch]
  );

  return [singleHopOnly, setSingleHopOnly];
}

export function useUserDeadline(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const userDeadline = useSelector<AppState, AppState["user"]["userDeadline"]>(
    (state) => {
      return state.user.userDeadline;
    }
  );

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }));
    },
    [dispatch]
  );

  return [userDeadline, setUserDeadline];
}

export function useUserSlippageTolerance(): [
  number,
  (slippage: number) => void
] {
  const dispatch = useAppDispatch();
  const userSlippageTolerance = useSelector<
    AppState,
    AppState["user"]["userSlippageTolerance"]
  >((state) => {
    return state.user.userSlippageTolerance;
  });

  const setUserSlippageTolerance = useCallback(
    (slippage: number) => {
      dispatch(
        updateUserSlippageTolerance({ userSlippageTolerance: slippage })
      );
    },
    [dispatch]
  );

  return [userSlippageTolerance, setUserSlippageTolerance];
}

// Get user preference for exchange price chart
// For mobile layout chart is hidden by default
export function useExchangeChartManager(
  isMobile: boolean
): [boolean, (isDisplayed: boolean) => void] {
  const dispatch = useAppDispatch();
  const isChartDisplayed = useSelector<
    AppState,
    AppState["user"]["isExchangeChartDisplayed"]
  >((state) => state.user.isExchangeChartDisplayed);

  const setUserChartPreference = useCallback(
    (isDisplayed: boolean) => {
      dispatch(setIsExchangeChartDisplayed(isDisplayed));
    },
    [dispatch]
  );

  return [isMobile ? false : isChartDisplayed, setUserChartPreference];
}

export function useExchangeChartViewManager() {
  const dispatch = useAppDispatch();
  const chartViewMode = useSelector<
    AppState,
    AppState["user"]["userChartViewMode"]
  >((state) => state.user.userChartViewMode);

  const setUserChartViewPreference = useCallback(
    (view: ChartViewMode) => {
      dispatch(setChartViewMode(view));
    },
    [dispatch]
  );

  return [chartViewMode, setUserChartViewPreference] as const;
}

export function useZapModeManager() {
  const dispatch = useAppDispatch();
  const zapEnabled = useSelector<AppState, AppState["user"]["userZapDisabled"]>(
    (state) => !state.user.userZapDisabled
  );

  const setZapEnable = useCallback(
    (enable: boolean) => {
      dispatch(setZapDisabled(!enable));
    },
    [dispatch]
  );

  return [zapEnabled, setZapEnable] as const;
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const userDeadline = useSelector<AppState, AppState["user"]["userDeadline"]>(
    (state) => {
      return state.user.userDeadline;
    }
  );

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }));
    },
    [dispatch]
  );

  return [userDeadline, setUserDeadline];
}

export function useFeeDataWithGasPrice(chainIdOverride?: number): {
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
} {
  const { chainId: chainId_ } = useWeb3React();
  const chainId = chainIdOverride ?? chainId_;
  const gasPrice = useGasPrice(chainId);
  const { data } = useFeeData({
    chainId,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
    watch: true,
  });

  if (gasPrice) {
    return {
      gasPrice,
    };
  }

  return (data?.formatted ?? {
    gasPrice: undefined,
  }) as {
    gasPrice: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
  };
}

/**
 * Note that this hook will only works well for BNB chain
 */
export function useGasPrice(chainIdOverride?: number): string | undefined {
  const { chainId: _chainId, provider } = useWeb3React();
  const chainId = chainIdOverride ?? _chainId;
  const userGas = useSelector<AppState, AppState["user"]["gasPrice"]>(
    (state) => state.user.gasPrice
  );
  const { data: bscProviderGasPrice = GAS_PRICE_GWEI.default } = useQuery(
    provider &&
      chainId === ChainId.BSC &&
      userGas === GAS_PRICE_GWEI.rpcDefault && [
        "bscProviderGasPrice",
        _chainId,
      ] || [],
    async () => {
      const gasPrice = await provider.getGasPrice();
      return gasPrice.toString();
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  if (chainId === ChainId.BSC) {
    return userGas === GAS_PRICE_GWEI.rpcDefault
      ? bscProviderGasPrice
      : userGas;
  }
  if (chainId === ChainId.BSC_TESTNET) {
    return GAS_PRICE_GWEI.testnet;
  }
  return undefined;
}

export function useGasPriceManager(): [string, (userGasPrice: string) => void] {
  const dispatch = useAppDispatch();
  const userGasPrice = useSelector<AppState, AppState["user"]["gasPrice"]>(
    (state) => state.user.gasPrice
  );

  const setGasPrice = useCallback(
    (gasPrice: string) => {
      dispatch(updateGasPrice({ gasPrice }));
    },
    [dispatch]
  );

  return [userGasPrice, setGasPrice];
}

export function useTrackedTokenPairs(): [ERC20Token, ERC20Token][] {
  const { chainId } = useWeb3React();
  const tokens = useOfficialsAndUserAddedTokens();

  // pinned pairs
  const pinnedPairs = useMemo(
    () => (chainId ? PINNED_PAIRS[chainId] ?? [] : []),
    [chainId]
  );

  const fetchFarmPairs = async (id: number) => {
    const farms = await getFarmConfig(id);

    const fPairs: [ERC20Token, ERC20Token][] = farms
      .filter((farm: { pid: number; }) => farm.pid !== 0)
      .map((farm: { token: SerializedWrappedToken; quoteToken: SerializedWrappedToken; }) => [
        deserializeToken(farm.token),
        deserializeToken(farm.quoteToken),
      ]);

    return fPairs;
  };

  const { data: farmPairs = [] } = useQuery(
    ["track-farms-pairs", chainId],
    () => fetchFarmPairs(chainId),
    {
      enabled: Boolean(chainId),
    }
  );
  // pairs for every token against every base
  const generatedPairs: [ERC20Token, ERC20Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress];
            // for each token on the current chain,
            return (
              // loop through all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base: { address: any; }) => {
                  const baseAddress = isAddress(base.address) ?? "";

                  if (baseAddress && baseAddress === tokenAddress) {
                    return null;
                  }
                  return [base, token];
                })
                .filter((p: any): p is [ERC20Token, ERC20Token] => p !== null)
            );
          })
        : [],
    [tokens, chainId]
  );

  // pairs saved by users
  const savedSerializedPairs = useSelector<AppState, AppState["user"]["pairs"]>(
    ({ user: { pairs } }) => pairs
  );

  const userPairs: [ERC20Token, ERC20Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return [];
    const forChain = savedSerializedPairs[chainId];
    if (!forChain) return [];

    return Object.keys(forChain).map((pairId) => {
      return [
        deserializeToken(forChain[pairId].token0),
        deserializeToken(forChain[pairId].token1),
      ];
    });
  }, [savedSerializedPairs, chainId]);

  const combinedList = useMemo(
    () =>
      userPairs.concat(generatedPairs).concat(pinnedPairs).concat(farmPairs),
    [generatedPairs, pinnedPairs, userPairs, farmPairs]
  );

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{
      [key: string]: [ERC20Token, ERC20Token];
    }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB);
      const key = sorted
        ? `${isAddress(tokenA.address)}:${isAddress(tokenB.address)}`
        : `${isAddress(tokenB.address)}:${isAddress(tokenA.address)}`;
      if (memo[key]) return memo;
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
      return memo;
    }, {});

    return Object.keys(keyed).map((key) => keyed[key]);
  }, [combinedList]);
}

export function toV2LiquidityToken([tokenA, tokenB]: [
  ERC20Token,
  ERC20Token
]): ERC20Token {
  return new ERC20Token(
    tokenA.chainId,
    Pair.getAddress(tokenA, tokenB),
    18,
    "Cake-LP",
    "Pancake LPs"
  );
}
