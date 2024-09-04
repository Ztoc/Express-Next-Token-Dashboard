import { ChainId } from "@pancakeswap/sdk";
import { TokenAddressMap } from "@pancakeswap/token-lists";
import { getAddress } from "@src/utils/address.utils";
import { constants } from "ethers";
import tokens from "./tokens";
import contracts from "./contracts";

export const MAX_INT = constants.MaxUint256;

export const FAST_INTERVAL = 1000 * 10;
export const SLOW_INTERVAL = 1000 * 60 * 2;


export const EMPTY_LIST: TokenAddressMap<ChainId> = {
    [ChainId.BSC]: {},
    [ChainId.BSC_TESTNET]: {},
    [ChainId.ETHEREUM]: {},
    [ChainId.GOERLI]: {}
};


// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const APP_FARMS_REFERRAL_CODE_KEY = "APP_FARMS_REFERRAL_CODE";

export const DEFAULT_NO_STATS = "--";
export const BNB_ADDRESS = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";

export const DEFAULT_INPUT_CURRENCY = getAddress(tokens.usdt.address, 56);
// GLR
export const DEFAULT_OUTPUT_CURRENCY = getAddress(contracts.glory, 56);