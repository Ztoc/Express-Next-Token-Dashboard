import {
  Currency,
  CurrencyAmount,
  ERC20Token,
  Fraction,
  JSBI,
  ONE_HUNDRED_PERCENT,
  Percent,
  Token,
  Trade,
  TradeType,
} from "@pancakeswap/sdk";
import { ChainId } from "@src/configs/web3/chains";
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BIPS_BASE,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from "@src/constants/exchange";
import { bscTokens } from "@src/constants/tokens/56";
import { bscTestnetTokens } from "@src/constants/tokens/97";
import { Field } from "@src/containers/HomePage/Swap";

export const BASES_TO_TRACK_LIQUIDITY_FOR: any = {
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.dai,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.cake,
  ],
  [ChainId.BSC_TESTNET]: [
    bscTestnetTokens.wbnb,
    bscTestnetTokens.cake,
    bscTestnetTokens.busd,
  ],
};

export const PINNED_PAIRS: any = {
  [ChainId.BSC]: [
    [bscTokens.cake, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
};

export const BASE_FEE = new Percent(JSBI.BigInt(25), BIPS_BASE);

export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE);

export const ROUTER_ADDRESS: Record<string, string> = {
  [ChainId.BSC]: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  [ChainId.BSC_TESTNET]: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
};

export function calculateSlippageAmount(
  value: CurrencyAmount<Currency>,
  slippage: number
): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(
      JSBI.multiply(value.quotient, JSBI.BigInt(10000 - slippage)),
      BIPS_BASE
    ),
    JSBI.divide(
      JSBI.multiply(value.quotient, JSBI.BigInt(10000 + slippage)),
      BIPS_BASE
    ),
  ];
}

export function warningSeverity(
  priceImpact: Percent | undefined
): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1;
  return 0;
}

export function computeSlippageAdjustedAmounts(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: number
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage);
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  };
}

export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), BIPS_BASE);
}

export function computeTradePriceBreakdown(
  trade?: Trade<Currency, Currency, TradeType> | null
): {
  priceImpactWithoutFee: Percent | undefined;
  realizedLPFee: CurrencyAmount<Currency> | undefined | null;
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
      trade.route.pairs.reduce<Fraction>(
        (currentFee: Fraction): Fraction =>
          currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT
      )
    );

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction =
    trade && realizedLPFee
      ? trade.priceImpact.subtract(realizedLPFee)
      : undefined;

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(
      priceImpactWithoutFeeFraction?.numerator,
      priceImpactWithoutFeeFraction?.denominator
    )
    : undefined;

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    CurrencyAmount.fromRawAmount(
      trade.inputAmount.currency,
      realizedLPFee.multiply(trade.inputAmount.quotient).quotient
    );

  return {
    priceImpactWithoutFee: priceImpactWithoutFeePercent,
    realizedLPFee: realizedLPFeeAmount,
  };
}
