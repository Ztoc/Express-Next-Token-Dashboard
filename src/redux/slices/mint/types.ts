import { ChainId, JSBI } from "@pancakeswap/sdk";

export const SUPPORT_ZAP = [ChainId.BSC, ChainId.BSC_TESTNET];

export const MAX_ZAP_REVERSE_RATIO = JSBI.BigInt(50);

export enum FetchStatus {
  Idle = "IDLE", 
  Fetching = "FETCHING",
  Fetched = "FETCHED",
  Failed = "FAILED",
}
