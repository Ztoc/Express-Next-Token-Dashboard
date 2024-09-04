import { ChainId, ERC20Token } from "@pancakeswap/sdk";

export const getTokenBySymbol = (symbol: string, chainId = 56) => {
  return tokens.find(
    (t) =>
      t?.symbol?.toLowerCase() === symbol?.toLowerCase() &&
      t?.chainId === chainId
  );
};

export const tokens = [
  {
    name: "Mike",
    symbol: "MKT",
    logoUrl:
      "https://photos.pinksale.finance/file/pinksale-logo-upload/1687352048919-2c4552ecdfc49258fc33818ac4da1742.png",
    decimals: 18,
    chainId: 97,
    address: "0x6C62F8a8deDd262beA9351C9bCAA56ADC558d05D",
  },
  {
    name: "Mike",
    symbol: "MKT",
    logoUrl:
      "https://photos.pinksale.finance/file/pinksale-logo-upload/1687352048919-2c4552ecdfc49258fc33818ac4da1742.png",
    decimals: 18,
    chainId: 56,
    address: "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
  },
  {
    symbol: "USDT",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    decimals: 18,
    name: "Tether USD",
    address: "0x55d398326f99059fF775485246999027B3197955",
    chainId: 56,
  },
  {
    name: "Mike",
    symbol: "MKT",
    logoUrl:
      "https://photos.pinksale.finance/file/pinksale-logo-upload/1687352048919-2c4552ecdfc49258fc33818ac4da1742.png",
    decimals: 18,
    chainId: 97,
    address: "0x8545f2473324124c5371F831075A3163AF22f34F",
  },
  {
    symbol: "USDT",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    decimals: 18,
    name: "Tether USD",
    address: "0x8545f2473324124c5371F831075A3163AF22f34F",
    chainId: 97,
  },
];

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

export const MKT_MANNET = new ERC20Token(
  ChainId.BSC,
  "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
  18,
  "MKT",
  "MKT",
  "https://miketoken.io/"
);

export const MKT_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  "0x6C62F8a8deDd262beA9351C9bCAA56ADC558d05D",
  18,
  "MKT",
  "MKT",
  "https://miketoken.io/"
);

export const MKT = {
  [ChainId.BSC]: MKT_MANNET,
  [ChainId.BSC_TESTNET]: MKT_TESTNET,
};

export const BUSD = {
  [ChainId.BSC]: BUSD_BSC,
  [ChainId.BSC_TESTNET]: BUSD_TESTNET,
};

export const USDT = {
  [ChainId.BSC]: USDT_BSC,
  [ChainId.BSC_TESTNET]: USDT_BSC,
};
