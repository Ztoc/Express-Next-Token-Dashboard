import type { Currency, CurrencyAmount, Trade } from "@pancakeswap/sdk";
import { ChainId, Price, TradeType } from "@pancakeswap/sdk";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";

import { useUserSlippageTolerance } from "../user/hooks";
import { Field, replaceSwapState } from "./actions";
import type { SwapState } from "./reducer";
import { AppState, useAppDispatch } from "@src/redux/store";
import { CAKE_MAINNET, CAKE_TESTNET } from "@src/constants/tokens/common";
import { getTokenAddress } from "@src/utils/swap";
import tryParseAmount from "@src/utils/tryParseAmount";
import { useBestTrade } from "@src/hooks/swap/useBestTrade";
import { useCurrencyBalances } from "@src/hooks/wallet";
import { useTradeExactIn, useTradeExactOut } from "@src/hooks/swap/Trades";
import { computeSlippageAdjustedAmounts } from "@src/utils/exchange";
import { isAddress } from "@src/utils/common";
import {
  DEFAULT_INPUT_CURRENCY,
  DEFAULT_OUTPUT_CURRENCY,
} from "@src/constants";
import { useWeb3React } from "@src/hooks/useWeb3React";
import useNativeCurrency from "@src/hooks/useNativeCurrency";
import { getAddress } from "@src/utils/address.utils";
import contracts from "@src/constants/contracts";
import tokens from "@src/constants/tokens";
import tryParseAmount1 from "@src/utils/tryParseAmount1";

export function useSwapState(): AppState["swap"] {
  return useSelector<AppState, AppState["swap"]>((state) => state.swap);
}

export const CAKE = {
  [ChainId.BSC]: CAKE_MAINNET,
  [ChainId.BSC_TESTNET]: CAKE_TESTNET,
};
// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", // v2 factory
  "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a", // v2 router 01
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // v2 router 02
];

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(
  trade: Trade<Currency, Currency, TradeType>,
  checksummedAddress: string
): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some(
      (pair) => pair.liquidityToken.address === checksummedAddress
    )
  );
}

// Get swap price for single token disregarding slippage and price impact
export function useSingleTokenSwapInfo(
  inputCurrencyId: string | undefined,
  inputCurrency: Currency | undefined,
  outputCurrencyId: string | undefined,
  outputCurrency: Currency | undefined
): { [key: string]: number } {
  const token0Address = getTokenAddress(inputCurrencyId);
  const token1Address = getTokenAddress(outputCurrencyId);

  const parsedAmount = tryParseAmount("1", inputCurrency ?? undefined);

  const bestTradeExactIn = useBestTrade(
    parsedAmount as any,
    outputCurrency ?? (undefined as any),
    TradeType.EXACT_INPUT
  );
  if (!inputCurrency || !outputCurrency || !bestTradeExactIn) {
    return null as any;
  }

  let inputTokenPrice: number = 0;
  try {
    inputTokenPrice = parseFloat(
      new Price({
        baseAmount: bestTradeExactIn.inputAmount,
        quoteAmount: bestTradeExactIn.outputAmount,
      }).toSignificant(6)
    );
  } catch (error) {
    //
  }
  if (!inputTokenPrice) {
    return null as any;
  }
  const outputTokenPrice = 1 / inputTokenPrice;

  return {
    [token0Address]: inputTokenPrice,
    [token1Address]: outputTokenPrice,
  };
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  recipient: string
): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };
  parsedAmount: CurrencyAmount<Currency> | undefined;
  v2Trade: Trade<Currency, Currency, TradeType> | undefined;
  inputError?: string;
} {
  const { account } = useWeb3React();

  const to: any =
    (recipient === null ? account : isAddress(recipient) || null) ?? null;

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(
      () => [inputCurrency ?? undefined, outputCurrency ?? undefined],
      [inputCurrency, outputCurrency]
    )
  );
  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount1(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );
  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined
  );
  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined
  );

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = "Connect Wallet";
  }

  if (!parsedAmount) {
    inputError = inputError ?? "Enter an amount";
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? "Select a token";
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? "Enter a recipient";
  } else if (
    BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo as any) !== -1 ||
    (bestTradeExactIn &&
      involvesAddress(bestTradeExactIn, formattedTo as any)) ||
    (bestTradeExactOut &&
      involvesAddress(bestTradeExactOut, formattedTo as any))
  ) {
    inputError = inputError ?? "Invalid recipient";
  }

  const [allowedSlippage] = useUserSlippageTolerance();

  const slippageAdjustedAmounts =
    v2Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ];

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = `Insufficient ${amountIn.currency.symbol} balance`;
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError,
  };
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === "string" && !Number.isNaN(parseFloat(urlParam))
    ? urlParam
    : "";
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === "string" && urlParam.toLowerCase() === "output"
    ? Field.OUTPUT
    : Field.INPUT;
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== "string") return null;
  const address = isAddress(recipient);
  if (address) return address;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

export function queryParametersToSwapState(
  parsedQs: ParsedUrlQuery,
  nativeSymbol?: string,
  defaultOutputCurrency?: string
): SwapState {
  let inputCurrency =
    isAddress(parsedQs.inputCurrency) ||
    (nativeSymbol ?? DEFAULT_INPUT_CURRENCY);
  let outputCurrency =
    typeof parsedQs.outputCurrency === "string"
      ? isAddress(parsedQs.outputCurrency) || nativeSymbol
      : defaultOutputCurrency ?? DEFAULT_OUTPUT_CURRENCY;
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === "string") {
      inputCurrency = "";
    } else {
      outputCurrency = "";
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient);

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    pairDataById: {},
    derivedPairDataById: {},
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined;
      outputCurrencyId: string | undefined;
    }
  | undefined {
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const native = useNativeCurrency();
  const { query } = useRouter();
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined;
        outputCurrencyId: string | undefined;
      }
    | undefined
  >();

  useEffect(() => {
    if (!chainId || !native) return;
    const mikeTokenAddress = getAddress(tokens.mike.address, chainId);
    const parsed = queryParametersToSwapState(query, "bnb", mikeTokenAddress);

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue || "1",
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: null,
      })
    );

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    });
  }, [dispatch, chainId, query, native]);

  return result;
}
