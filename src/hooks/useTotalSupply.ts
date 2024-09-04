import type { Currency, Token } from "@pancakeswap/sdk";
import { CurrencyAmount } from "@pancakeswap/sdk";
import { useMemo } from "react";

import { useSingleCallResult } from "@src/redux/slices/multicall/hooks";
import erc20ABI from "../configs/abis/erc20.json";

import { getContract } from "@src/utils/contractHelper";
import { useWeb3React } from "./useWeb3React";
import { useSigner } from "wagmi";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export default function useTotalSupply(
  token?: Currency
): CurrencyAmount<Token> | undefined {
  const { chainId } = useWeb3React();
  const { data: signer } = useSigner();

  const contract = getContract(
    (token?.isToken ? token?.address : "") ||
      "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
    erc20ABI,
    chainId,
    signer
  );

  const totalSupplyStr: string | undefined = useSingleCallResult(
    contract,
    "totalSupply"
  )?.result?.[0]?.toString();

  return useMemo(
    () =>
      token?.isToken && totalSupplyStr
        ? CurrencyAmount.fromRawAmount(token, totalSupplyStr)
        : undefined,
    [token, totalSupplyStr]
  );
}
