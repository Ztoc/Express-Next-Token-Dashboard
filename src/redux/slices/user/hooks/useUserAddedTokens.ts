import type { Token } from "@pancakeswap/sdk";
import { deserializeToken } from "@pancakeswap/token-lists";
import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { useWeb3React } from "@src/hooks/useWeb3React";
import type { AppState } from "@src/redux/store";

const selectUserTokens = ({ user: { tokens } }: AppState) => tokens;

export const userAddedTokenSelector = (chainId: number) =>
  createSelector(selectUserTokens, (serializedTokensMap) =>
    // @ts-ignore
    Object.values(serializedTokensMap?.[chainId] ?? {}).map(deserializeToken)
  );
export default function useUserAddedTokens(): Token[] {
  const { chainId } = useWeb3React();
  return useSelector(useMemo(() => userAddedTokenSelector(chainId), [chainId]));
}
