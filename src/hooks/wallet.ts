import { Currency, CurrencyAmount, JSBI, Native, Token } from "@pancakeswap/sdk";
import {
  useMultipleContractSingleData,
  useSingleContractMultipleData,
} from "@src/redux/slices/multicall/hooks";
import { isAddress } from "@src/utils/common";
import { useMemo } from "react";
import ERC20_INTERFACE from "@src/configs/abis/erc20";
import { orderBy } from "lodash";
import contracts from "@src/constants/contracts";
import { useWeb3React } from "./useWeb3React";
import useNativeCurrency from "./useNativeCurrency";
import { useAccount, useSigner } from "wagmi";
import { useAllTokens } from "./Tokens";
import { getContract } from "@src/utils/contractHelper";
import multicallABI from "@src/configs/abis/Multicall.json";
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
    [tokens]
  );
  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );
  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    useMemo(() => [address], [address])
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState: { loading: any }) => callState.loading),
    [balances]
  );

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: CurrencyAmount<Token> | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = CurrencyAmount.fromRawAmount(
                  token,
                  amount as any
                );
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useTokenBalance(
  account?: string,
  token?: Token
): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(
    account,
    useMemo(() => [token], [token])
  );
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () =>
      // @ts-ignore
      currencies?.filter((currency): currency is Token => currency?.isToken) ??
      [],
    [currencies]
  );
  const tokenBalances = useTokenBalances(account, tokens);
  const containsNative: boolean = useMemo(
    () => currencies?.some((currency) => currency?.isNative) ?? false,
    [currencies]
  );
  const uncheckedAddresses = useMemo(
    () => (containsNative ? [account] : []),
    [containsNative, account]
  );

  const nativeBalance = useNativeBalances(uncheckedAddresses);
  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined;
        if (currency?.isToken)
          return tokenBalances[currency.address];
        if (currency?.isNative) return nativeBalance[account];
        return undefined;
      }) ?? [],
    [account, currencies, nativeBalance, tokenBalances]
  );
}

export function useNativeBalances(
  uncheckedAddresses?: (string | undefined)[]
): {
  [address: string]: CurrencyAmount<Native> | undefined;
} {
  const { chainId } = useWeb3React();
  const native = useNativeCurrency();
  const { data: signer } = useSigner();
  const multicallContract = getContract(
    contracts.multiCall[chainId],
    multicallABI,
    chainId,
    signer
  );
  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? orderBy(
            uncheckedAddresses
              .map(isAddress)
              .filter((a): a is string => a !== false)
          )
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    useMemo(() => addresses.map((address) => [address]), [addresses])
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount<Native> }>(
        (memo, address, i) => {
          const value = results?.[i]?.result?.[0];
          if (value)
            memo[address] = CurrencyAmount.fromRawAmount(
              native,
              JSBI.BigInt(value.toString())
            );
          return memo;
        },
        {}
      ),
    [addresses, results, native]
  );
}

// mimics useAllBalances
export function useAllTokenBalances(): {
  [tokenAddress: string]: CurrencyAmount<Token> | undefined;
} {
  const { address: account } = useAccount();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  );
  const balances = useTokenBalances(account ?? undefined, allTokensArray);
  return balances ?? {};
}

export function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency])
  )[0];
}
