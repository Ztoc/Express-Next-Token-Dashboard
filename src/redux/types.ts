import { parseUnits } from "@ethersproject/units";

export interface UserDataState {
  balanceGLR: number;
}

export enum GAS_PRICE {
  default = "5",
  fast = "6",
  instant = "7",
  testnet = "10",
}

export const GAS_PRICE_GWEI = {
  rpcDefault: "rpcDefault",
  default: parseUnits(GAS_PRICE.default, "gwei").toString(),
  fast: parseUnits(GAS_PRICE.fast, "gwei").toString(),
  instant: parseUnits(GAS_PRICE.instant, "gwei").toString(),
  testnet: parseUnits(GAS_PRICE.testnet, "gwei").toString(),
};

export interface FarmDataState {
  userData: UserData[];
  config: FarmConfig[];
}

export interface UserData {
  pid: number;
  stakedBalance: string;
  allowance: string;
  tokenBalance: string;
  earnings: string;
  nextHarvestUntil: number;
  factor: string;
  id: string;
  boostedApr?: string;
}

export interface FarmConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  pid: number;
  isGlr: boolean;
  chainId: number;
  vaultPid: any;
  lpSymbol: string;
  stakingAddress: string;
  vaultAddress: any;
  lpAddress: string;
  token: Token;
  quoteToken: QuoteToken;
  earnedToken: EarnedToken;
  multiplier: string;
  rewardPerBlock: number;
  earnLabel: string;
  endBlock: number;
  isTrending: boolean;
  harvestLockupPeriod: number;
  apr: string;
  tvl: string;
  basePartition: string;
  sumOfFactors: string;
  yearlyRewardAllocation: string;
  isStaked?: boolean;
}

export interface Token {
  symbol: string;
  address: string;
  decimals: number;
  projectLink: string;
  chainId: number;
}

export interface QuoteToken {
  symbol: string;
  address: string;
  decimals: number;
  projectLink: string;
  chainId: number;
}

export interface EarnedToken {
  symbol: string;
  address: string;
  decimals: number;
  projectLink: string;
  chainId: number;
}

export interface Prices {
  [address: string]: string;
}

export interface PriceState {
  prices: Prices;
}

export interface PoolData {
  userData: UserData;
  totalStaked: number;
  totalLocked: number;
  pid: number;
}

export interface PoolState {
  data: PoolData[];
}
