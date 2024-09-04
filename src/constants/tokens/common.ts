import { ERC20Token } from "@pancakeswap/sdk";
import { ChainId } from "@src/configs/web3/chains";


export const CAKE_MAINNET = new ERC20Token(
  ChainId.BSC,
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  18,
  "CAKE",
  "PancakeSwap Token",
  "https://pancakeswap.finance/"
);

export const CAKE_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  "0xFa60D973F7642B748046464e165A65B7323b0DEE",
  18,
  "CAKE",
  "PancakeSwap Token",
  "https://pancakeswap.finance/"
);

export const USDC_BSC = new ERC20Token(
  ChainId.BSC,
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  18,
  "USDC",
  "Binance-Peg USD Coin",
  "https://www.centre.io/usdc"
);

export const USDC_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  "0x64544969ed7EBf5f083679233325356EbE738930",
  18,
  "USDC",
  "Binance-Peg USD Coin",
  "https://www.centre.io/usdc"
);

export const USDT_BSC = new ERC20Token(
  ChainId.BSC,
  "0x55d398326f99059fF775485246999027B3197955",
  18,
  "USDT",
  "Tether USD",
  "https://tether.to/"
);

export const BUSD_BSC = new ERC20Token(
  ChainId.BSC,
  "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  18,
  "BUSD",
  "Binance USD",
  "https://www.paxos.com/busd/"
);

export const BUSD_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
  18,
  "BUSD",
  "Binance USD",
  "https://www.paxos.com/busd/"
);

export const BUSD: Record<ChainId, ERC20Token> = {
  [ChainId.BSC]: BUSD_BSC,
  [ChainId.BSC_TESTNET]: BUSD_TESTNET,
};

export const CAKE = {
  [ChainId.BSC]: CAKE_MAINNET,
  [ChainId.BSC_TESTNET]: CAKE_TESTNET,
};

export const USDC = {
  [ChainId.BSC]: USDC_BSC,
  [ChainId.BSC_TESTNET]: USDC_TESTNET,
};

export const USDT = {
  [ChainId.BSC]: USDT_BSC,
};



export const BTCB = new ERC20Token(
  ChainId.BSC,
  "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
  18,
  "BTCB",
  "Binance BTC",
  "https://bitcoin.org/"
);

export const ETH = new ERC20Token(
  ChainId.BSC,
  "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  18,
  "ETH",
  "Binance-Peg Ethereum Token",
  "https://ethereum.org/en/"
);



export const DAI = new ERC20Token(
  ChainId.BSC,
  "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
  18,
  "DAI",
  "Dai Stablecoin",
  "https://www.makerdao.com/"
);
