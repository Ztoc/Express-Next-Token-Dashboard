import invert from "lodash/invert";
import memoize from "lodash/memoize";
import type { Chain } from "wagmi";

const bscExplorer = { name: "BscScan", url: "https://bscscan.com" };
const bscTestnetExplorer = {
  name: "BscScan Testnet",
  url: "https://testnet.bscscan.com",
};
const polygonExplorer = { name: "Polygon", url: "https://polygonscan.com" };
const polygonTestnetExplorer = {
  name: "Polygon Testnet",
  url: "https://mumbai.polygonscan.com",
};

export interface ChainConfig extends Chain {
  logoURI: string;
}

export enum ChainId {
  BSC = 56,
  BSC_TESTNET = 97,
}

export const multicallAddress: Record<ChainId, string> = {
  [ChainId.BSC]: "0xcA11bde05977b3631167028862bE2a173976CA11",
  [ChainId.BSC_TESTNET]: "0xcA11bde05977b3631167028862bE2a173976CA11",
};

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export type RpcConfig = Record<ChainId, string[]>;
export const rpcConfig: RpcConfig = {
  [ChainId.BSC]: shuffleArray([
    "https://binance.llamarpc.com",
    "https://bsc-dataseed.bnbchain.org",
    "https://bsc-dataseed3.binance.org/",
    "https://bsc-dataseed4.defibit.io/",
    "https://bsc-dataseed2.ninicoin.io/",
  ]),
  [ChainId.BSC_TESTNET]: [
    "https://rpc.ankr.com/bsc_testnet_chapel",
    "https://data-seed-prebsc-2-s1.binance.org:8545/",
    "https://data-seed-prebsc-1-s2.binance.org:8545/",
    "https://data-seed-prebsc-1-s3.binance.org:8545/",
    "https://data-seed-prebsc-2-s3.binance.org:8545/",
  ],
};

export const bsc: ChainConfig = {
  id: 56,
  name: "BNB Chain",
  network: "bsc",
  rpcUrls: {
    default: {
      http: rpcConfig[ChainId.BSC],
    },
    public: {
      http: rpcConfig[ChainId.BSC],
    },
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
  },
  contracts: {
    multicall3: {
      address: multicallAddress[ChainId.BSC] as unknown as `0x${string}`,
      blockCreated: 15921452,
    },
  },
  logoURI: "https://statics.gloryfinance.io/assets/images/logo_bnb_chain.svg",
};

export const bscTest: ChainConfig = {
  id: 97,
  name: "BNB Chain Testnet",
  network: "bsc-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Chain Native Token",
    symbol: "tBNB",
  },
  rpcUrls: {
    default: {
      http: rpcConfig[ChainId.BSC_TESTNET],
    },
    public: {
      http: rpcConfig[ChainId.BSC_TESTNET],
    },
  },
  blockExplorers: {
    default: bscTestnetExplorer,
    etherscan: bscTestnetExplorer,
  },
  contracts: {
    multicall3: {
      address: multicallAddress[
        ChainId.BSC_TESTNET
      ] as unknown as `0x${string}`,
      blockCreated: 17422483,
    },
  },
  testnet: true,
  logoURI: "https://statics.gloryfinance.io/assets/images/logo_bnb_chain.svg",
};

export const chainList = [bsc, bscTest];

export const CHAIN_QUERY_NAME = {
  [ChainId.BSC]: "bsc",
  [ChainId.BSC_TESTNET]: "bscTestnet",
} satisfies Record<ChainId, string>;

const CHAIN_QUERY_NAME_TO_ID = invert(CHAIN_QUERY_NAME);

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined;
  return CHAIN_QUERY_NAME_TO_ID[chainName]
    ? +CHAIN_QUERY_NAME_TO_ID[chainName]
    : undefined;
});
