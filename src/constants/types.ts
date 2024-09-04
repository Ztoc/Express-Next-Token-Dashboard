import type {
  ChainId,
  Currency,
  CurrencyAmount,
  ERC20Token,
  Percent,
  Price,
  Token,
  Trade,
  TradeType,
} from "@pancakeswap/sdk";
import { TradeWithStableSwap } from "@pancakeswap/smart-router/dist/evm";

import type { SerializedWrappedToken } from "@pancakeswap/token-lists";

export type Addresses = { [key: string]: string };

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T;
};

export type ChainTokenList = ChainMap<Token[]>;

export interface BasePool {
  lpSymbol: string;
  lpAddress: string;
  token: SerializedWrappedToken;
  quoteToken: SerializedWrappedToken;
}

export interface StableSwapPool extends BasePool {
  stableSwapAddress: string;
  infoStableSwapAddress: string;
  stableLpFee: number;
  stableLpFeeRateOfTotalFee: number;
}

export interface BasePair {
  token0: Currency;
  token1: Currency;
  reserve0: CurrencyAmount<Currency>;
  reserve1: CurrencyAmount<Currency>;
  involvesToken: (token: Currency) => boolean;
}

export interface StableSwapPair extends BasePair {
  stableSwapAddress: string;
  lpAddress: string;
  infoStableSwapAddress: string;
  price: Price<Currency, Currency>;
  fee: Percent;
  adminFee: Percent;
  liquidityToken: ERC20Token;
  stableLpFee: number;
  stableLpFeeRateOfTotalFee: number;
}

export interface StableTrade {
  tradeType: TradeType;
  inputAmount: CurrencyAmount<Currency>;
  outputAmount: CurrencyAmount<Currency>;
  executionPrice: Price<Currency, Currency>;
  priceImpact: null;
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency>;
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency>;
}

export type ITrade =
  | Trade<Currency, Currency, TradeType>
  | StableTrade
  | TradeWithStableSwap<Currency, Currency, TradeType>
  | undefined;

export const isStableSwap = (trade: ITrade): trade is StableTrade => {
  return (
    Boolean((trade as StableTrade)?.maximumAmountIn) &&
    !(
      trade as
        | Trade<Currency, Currency, TradeType>
        | TradeWithStableSwap<Currency, Currency, TradeType>
    )?.route
  );
};

export type V2TradeAndStableSwap =
  | Trade<Currency, Currency, TradeType>
  | StableTrade
  | undefined;
