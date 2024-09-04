import contracts from "./contracts";

export interface ICardPool {
  title: string;
  symbol: string;
  tokenAddress: any;
  mtkAddress: any;
  contractStaking: any;
  image: string;
  background: string;
  startTime: number;
  depositEnd: number;
  endTime: number;
  tokenEarn?: any
  pid?: number;
  initStaked?:number
  stakedSymbol?: string
  isClassic?: boolean
}

export const listPool: ICardPool[] = [
  //     {
  //     title: 'MKT Pool',
  //     symbol: 'MKT',
  //     tokenAddress: contracts.usdt,
  //     contractStaking: contracts.gloryPool,
  //     image: '/images/logo-pool-mkt.svg',
  //     background: 'radial-gradient(38.94% 41.23% at -1.91% 32.86%, #7B5532 0%, rgba(119, 83, 50, 0.00) 100%), radial-gradient(122.59% 128.68% at 16.22% 0.00%, #14884A 0%, #113A2B 28.28%, #151616 56.99%)',
  // },
  {
    title: "USDT Pool",
    symbol: "USDT",
    tokenAddress: contracts.usdt,
    contractStaking: contracts.gloryPool,
    image: "/images/logo-pool-usdt.svg",
    background:
      "radial-gradient(38.94% 41.23% at -1.91% 32.86%, #354B85 0%, rgba(50, 78, 119, 0.00) 100%), radial-gradient(122.59% 128.68% at 16.22% 0.00%, #148888 0%, #11353A 28.28%, #151616 56.99%)",
    startTime: 0,
    depositEnd: 0,
    endTime: 0,
    mtkAddress: ''
  },
];
