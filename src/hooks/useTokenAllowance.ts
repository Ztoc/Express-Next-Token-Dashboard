import type { Token } from "@pancakeswap/sdk";
import { CurrencyAmount } from "@pancakeswap/sdk";
import { useMemo } from "react";
import { useTokenContract } from "./useCommonContract";
import { useSingleCallResult } from "@src/redux/slices/multicall/hooks";



function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.address, false) as any;

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const allowance = useSingleCallResult(contract, "allowance", inputs).result;

  return useMemo(
    () =>
      token && allowance
        ? CurrencyAmount.fromRawAmount(token, allowance.toString())
        : undefined,
    [token, allowance]
  );
}

export default useTokenAllowance;
