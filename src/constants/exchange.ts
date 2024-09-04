import { ERC20Token, JSBI, Percent, Token, WBNB } from "@pancakeswap/sdk";
import { ChainId } from "@src/configs/web3/chains";
import { ChainTokenList } from "./types";
import {
  BTCB,
  BUSD_BSC,
  BUSD_TESTNET,
  CAKE_MAINNET,
  CAKE_TESTNET,
  DAI,
  ETH,
  USDT_BSC,
} from "./tokens/common";

export const BIG_INT_ZERO = JSBI.BigInt(0);
export const BIPS_BASE = JSBI.BigInt(10000);

export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%

export const BIG_INT_TEN = JSBI.BigInt(10);
export const MIN_BNB: JSBI = JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(16)); // .01 BNB
// console.log("MIN_BNB", MIN_BNB);
export const CUSTOM_BASES: any = {
  [ChainId.BSC]: {},
};

export const wbnb = WBNB[ChainId.BSC];

export const USDC = new ERC20Token(
  ChainId.BSC,
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  18,
  "USDC",
  "Binance-Peg USD Coin",
  "https://www.centre.io/usdc"
);

export const BASES_TO_CHECK_TRADES_AGAINST: any = {
  [ChainId.BSC]: [wbnb, CAKE_MAINNET, BUSD_BSC, USDT_BSC, BTCB, ETH, USDC, DAI],
  [ChainId.BSC_TESTNET]: [
    WBNB[ChainId.BSC_TESTNET],
    CAKE_TESTNET,
    BUSD_TESTNET,
  ],
};

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: any = {
  [ChainId.BSC]: {},
};
