import { Interface } from "@ethersproject/abi";
import type { Currency, Token } from "@pancakeswap/sdk";
import { CurrencyAmount, ERC20Token, Pair } from "@pancakeswap/sdk";
import { useMemo } from "react";

import IPancakePairABI from "../configs/abis/IPancakePair.json";
import { useWeb3React } from "./useWeb3React";
import { wrappedCurrency } from "@src/utils/wrappedCurrency";
import { multicallv2 } from "@src/utils/multicall";
import useSWR from "swr";
import { useMultipleContractSingleData } from "@src/redux/slices/multicall/hooks";

const PAIR_INTERFACE = new Interface(IPancakePairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(
  currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | null][] {
  const { chainId } = useWeb3React();

  const tokens = useMemo(
    () =>
      currencies &&
      currencies.length > 0 &&
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies]
  );
  const pairAddresses = useMemo(
    () =>
      tokens &&
      tokens?.length > 0 &&
      tokens.map(([tokenA, tokenB]) => {
        try {
          const token1AsTokenInstance = new ERC20Token(
            tokenA?.chainId as any,
            tokenA?.address as string,
            tokenA?.chainId || 18,
            "Cake-LP"
          );

          const token2AsTokenInstance = new ERC20Token(
            tokenB?.chainId as any,
            tokenB?.address as string,
            tokenB?.chainId || 18,
            "Cake-LP"
          );

          return tokenA && tokenB && !tokenA.equals(tokenB)
            ? Pair.getAddress(token1AsTokenInstance, token2AsTokenInstance)
            : undefined;
        } catch (error: any) {
          // Debug Invariant failed related to this line
          console.error(
            error.msg,
            `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`,
            `chainId: ${tokenA?.chainId}`
          );

          return undefined;
        }
      }),
    [tokens]
  );

  const results = useMultipleContractSingleData(
    pairAddresses as string[],
    PAIR_INTERFACE,
    "getReserves"
  );

  return useMemo(() => {
    return (
      results &&
      results.length > 0 &&
      results.map((result: any, i: number) => {
        const { result: reserves, loading } = result;
        const tokenA = tokens && tokens[i][0];
        const tokenB = tokens && tokens[i][1];

        if (loading) return [PairState.LOADING, null];
        if (!tokenA || !tokenB || tokenA.equals(tokenB))
          return [PairState.INVALID, null];
        if (!reserves) return [PairState.NOT_EXISTS, null];
        const { reserve0, reserve1 } = reserves;

        const [token0, token1] = tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA];
        return [
          PairState.EXISTS,
          new Pair(
            CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
            CurrencyAmount.fromRawAmount(token1, reserve1.toString())
          ),
        ];
      })
    );
  }, [results, tokens]) as any;
}

export function usePair(
  tokenA?: Currency,
  tokenB?: Currency
): [PairState, Pair | null] {
  const pairCurrencies = useMemo<[Currency, Currency][]>(
    () => [[tokenA as any, tokenB as any]],
    [tokenA, tokenB]
  );
  return usePairs(pairCurrencies)[0];
}
