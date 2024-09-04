import { ChainId, Currency, ERC20Token } from "@pancakeswap/sdk";
import { useWeb3React } from "./useWeb3React";
import { useAtomValue } from "jotai";
import useUserAddedTokens from "@src/redux/slices/user/hooks/useUserAddedTokens";
import { useMemo } from "react";
import { TokenAddressMap } from "@pancakeswap/token-lists";
import { isAddress } from "@src/utils/common";
import {
  combinedTokenMapFromActiveUrlsAtom,
  combinedTokenMapFromOfficialsUrlsAtom,
  useUnsupportedTokenList,
  useWarningTokenList,
} from "@src/redux/slices/lists/hooks";
import useNativeCurrency from "./useNativeCurrency";
import { useQuery } from "@tanstack/react-query";
import multicall from "@src/utils/multicall";
import erc20ABI from "../configs/abis/erc20.json";
import { ERC20_BYTES32_ABI } from "@src/configs/abis/erc20";
import { arrayify } from "@ethersproject/bytes";
import { parseBytes32String } from "@ethersproject/strings";

const mapWithoutUrls = (tokenMap: TokenAddressMap<ChainId>, chainId: number) =>
  // @ts-ignore
  Object.keys(tokenMap[chainId] || {}).reduce<{
    [address: string]: ERC20Token;
  }>((newMap, address) => {
    const checksummedAddress = isAddress(address);

    if (checksummedAddress && !newMap[checksummedAddress]) {
      // @ts-ignore
      newMap[checksummedAddress] = tokenMap[chainId][address].token;
    }

    return newMap;
  }, {});
  const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

/**
 * Returns all tokens that are from officials token list and user added tokens
 */
export function useOfficialsAndUserAddedTokens(): {
  [address: string]: ERC20Token;
} {
  const { chainId } = useWeb3React();
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom);
  const userAddedTokens = useUserAddedTokens();

  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            // @ts-ignore
            const checksummedAddress = isAddress(token.address);

            if (checksummedAddress) {
              tokenMap_[checksummedAddress] = token;
            }

            return tokenMap_;
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId)
        )
    );
  }, [userAddedTokens, tokenMap, chainId]);
}

/**
 * Returns all tokens that are from active urls and user added tokens
 */
export function useAllTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useWeb3React();

  const tokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom);
  const userAddedTokens = useUserAddedTokens();

  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            // @ts-ignore
            const checksummedAddress = isAddress(token.address);

            if (checksummedAddress) {
              tokenMap_[checksummedAddress] = token;
            }

            return tokenMap_;
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId)
        )
    );
  }, [userAddedTokens, tokenMap, chainId]);
}

function parseStringOrBytes32(
  str: string | undefined,
  bytes32: string | undefined,
  defaultValue: string
): string {
  // eslint-disable-next-line no-nested-ternary
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}
export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const { chainId } = useWeb3React();
  const tokens = useAllTokens();

  const address = isAddress(tokenAddress);

  const token: ERC20Token | undefined = address ? tokens[address] : undefined;

  const { data, status } = useQuery(
    (!token && chainId && address && ["fetchTokenInfo", chainId, address]) ||
      [],
    async () => {
      const calls = ["name", "symbol", "decimals"].map((method) => {
        return { address: address.toString(), name: method };
      });

      return multicall(erc20ABI, calls, chainId);
    },
    {
      refetchInterval: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const tokenName = data?.[0]?.[0];
  const symbol = data?.[1]?.[0];
  const decimals = data?.[2]?.[0];

  const { data: dataBytes, status: statusBytes } = useQuery(
    (!token &&
      chainId &&
      address &&
      (status === "success" || status === "error") &&
      (!tokenName || !symbol) && ["fetchTokenInfo32", chainId, address]) ||
      [],
    async () => {
      const calls = ["name", "symbol"].map((method) => {
        return { address: address.toString(), name: method };
      });

      return multicall(ERC20_BYTES32_ABI, calls, chainId);
    },
    {
      refetchInterval: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const tokenNameBytes32 = dataBytes?.[0]?.[0];
  const symbolBytes32 = dataBytes?.[1]?.[0];

  return useMemo(() => {
    if (token) return token;
    if (!chainId || !address) return undefined;
    if (status !== "success") return null;
    if (Number.isInteger(decimals)) {
      return new ERC20Token(
        chainId,
        address,
        decimals,
        parseStringOrBytes32(symbol, symbolBytes32, "UNKNOWN"),
        parseStringOrBytes32(tokenName, tokenNameBytes32, "Unknown Token")
      );
    }
    return undefined;
  }, [
    address,
    chainId,
    status,
    statusBytes,
    decimals,
    symbol,
    symbolBytes32,
    token,
    tokenName,
    tokenNameBytes32,
  ]);
}
export function useCurrency(
  currencyId: string | undefined
): Currency | ERC20Token | null | undefined {
  const native = useNativeCurrency();
  const isNative = currencyId?.toUpperCase() === native.symbol?.toUpperCase();
  const token = useToken(isNative ? undefined : currencyId);
  return isNative ? native : token;
}

export function useUnsupportedTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useWeb3React();
  const unsupportedTokensMap = useUnsupportedTokenList();
  return useMemo(
    () => mapWithoutUrls(unsupportedTokensMap, chainId),
    [unsupportedTokensMap, chainId]
  );
}

export function useWarningTokens(): { [address: string]: ERC20Token } {
  const warningTokensMap = useWarningTokenList();
  const { chainId } = useWeb3React();
  return useMemo(
    () => mapWithoutUrls(warningTokensMap, chainId),
    [warningTokensMap, chainId]
  );
}
