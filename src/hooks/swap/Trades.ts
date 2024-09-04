import {
  Currency,
  CurrencyAmount,
  JSBI,
  Pair,
  Percent,
  Token,
  Trade,
  TradeType,
  isTradeBetter,
} from "@pancakeswap/sdk";
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  BIPS_BASE,
  CUSTOM_BASES,
} from "@src/constants/exchange";
import { useMemo } from "react";
import { PairState, usePairs } from "../usePairs";
import { flatMap } from "lodash";
import { wrappedCurrency } from "@src/utils/wrappedCurrency";
import { useWeb3React } from "../useWeb3React";
import { useUnsupportedTokens } from "../Tokens";

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */

export function useTradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency
): Trade<Currency, Currency, TradeType> | null {
  const allowedPairs = useAllCommonPairs(
    currencyAmountIn?.currency,
    currencyOut
  );
  const singleHopOnly = false;
  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 1, maxNumResults: 1 })[0] ??
          null
        )
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade: Trade<Currency, Currency, TradeType> | null =
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: i, maxNumResults: 1 })[0] ??
          null
        // if current trade is best yet, save it
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade
        }
      }
      return bestTradeSoFar
    }

    return null;
  }, [allowedPairs, currencyAmountIn, currencyOut, singleHopOnly]);
}

const MAX_HOPS = 3;

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
  JSBI.BigInt(50),
  BIPS_BASE
);

export function useAllCommonPairs(
  currencyA?: Currency,
  currencyB?: Currency
): Pair[] {
  const { chainId } = useWeb3React();

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined];

  const bases: Token[] = useMemo(() => {
    if (!chainId) return [];

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];
    const additionalA = tokenA
      ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? []
      : [];
    const additionalB = tokenB
      ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? []
      : [];

    return [...common, ...additionalA, ...additionalB];
  }, [chainId, tokenA, tokenB]);

  const basePairs: [Token, Token][] = useMemo(
    () =>
      flatMap(bases, (base): [Token, Token][] =>
        bases.map((otherBase) => [base, otherBase])
      ),
    [bases]
  );

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
          // the direct pair
          [tokenA, tokenB],
          // token A against all bases
          ...bases.map((base): [Token, Token] => [tokenA, base]),
          // token B against all bases
          ...bases.map((base): [Token, Token] => [tokenB, base]),
          // each base against all bases
          ...basePairs,
        ]
          .filter((tokens): tokens is [Token, Token] =>
            Boolean(tokens[0] && tokens[1])
          )
          .filter(([t0, t1]) => t0.address !== t1.address)
          .filter(([tokenA_, tokenB_]) => {
            if (!chainId) return true;
            const customBases = CUSTOM_BASES[chainId];

            const customBasesA: Token[] | undefined =
              customBases?.[tokenA_.address];
            const customBasesB: Token[] | undefined =
              customBases?.[tokenB_.address];

            if (!customBasesA && !customBasesB) return true;

            if (
              customBasesA &&
              !customBasesA.find((base) => tokenB_.equals(base))
            )
              return false;
            if (
              customBasesB &&
              !customBasesB.find((base) => tokenA_.equals(base))
            )
              return false;

            return true;
          })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  );
  const allPairs = usePairs(allPairCombinations);
  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      allPairs &&
      Object.values(
        allPairs
          // filter out invalid pairs
          ?.filter((result): result is [PairState.EXISTS, Pair] =>
            Boolean(result[0] === PairState.EXISTS && result[1])
          )
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] =
              memo[curr.liquidityToken.address] ?? curr;
            return memo;
          }, {})
      ),
    [allPairs]
  );
}
export function useTradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>
): Trade<Currency, Currency, TradeType> | null {
  const allowedPairs = useAllCommonPairs(
    currencyIn,
    currencyAmountOut?.currency
  );

  // disable single hop trades
  const singleHopOnly = false;

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
            maxHops: 1,
            maxNumResults: 1,
          })[0] ?? null
        );
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null;
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade =
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
            maxHops: i,
            maxNumResults: 1,
          })[0] ?? null;
        if (
          isTradeBetter(
            bestTradeSoFar,
            currentTrade,
            BETTER_TRADE_LESS_HOPS_THRESHOLD
          )
        ) {
          bestTradeSoFar = currentTrade;
        }
      }
      return bestTradeSoFar;
    }
    return null;
  }, [currencyIn, currencyAmountOut, allowedPairs, singleHopOnly]);
}

export function useIsTransactionUnsupported(
  currencyIn?: Currency,
  currencyOut?: Currency
): boolean {
  const unsupportedTokens: { [address: string]: Token } =
    useUnsupportedTokens();
  const { chainId } = useWeb3React();

  const tokenIn = wrappedCurrency(currencyIn, chainId);
  const tokenOut = wrappedCurrency(currencyOut, chainId);

  // if unsupported list loaded & either token on list, mark as unsupported
  if (unsupportedTokens) {
    if (tokenIn && Object.keys(unsupportedTokens).includes(tokenIn.address)) {
      return true;
    }
    if (tokenOut && Object.keys(unsupportedTokens).includes(tokenOut.address)) {
      return true;
    }
  }

  return false;
}
