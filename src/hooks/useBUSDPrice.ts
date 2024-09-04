import {
  ChainId,
  Currency,
  CurrencyAmount,
  ERC20Token,
  Pair,
  Price,
  Token,
  WBNB,
} from "@pancakeswap/sdk";
import { BUSD, MKT } from "@src/configs/tokens";
import getLpAddress from "@src/utils/getLpAddress";
import useSWR from "swr";
import { useChainId, useProvider } from "wagmi";
import { usePairContract } from "./useContract";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
export const usePriceByPairs = (currencyA?: Currency, currencyB?: Currency) => {
  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped];
  const pairAddress = getLpAddress(tokenA as any, tokenB as any);
  const pairContract = usePairContract(pairAddress as any);
  const provider = useProvider({ chainId: currencyA?.chainId });

  const { data: price } = useSWR(
    currencyA && currencyB && ["pair-price", currencyA, currencyB],
    async () => {
      const reserves = await pairContract?.connect(provider).getReserves();
      if (!reserves) {
        return null;
      }
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA?.sortsBefore(tokenB as any)
        ? [tokenA, tokenB]
        : [tokenB, tokenA];

      const pair = new Pair(
        CurrencyAmount?.fromRawAmount(token0 as any, reserve0.toString()),
        CurrencyAmount?.fromRawAmount(token1 as any, reserve1.toString())
      );

      return pair.priceOf(tokenB as any);
    },
    { dedupingInterval: 10000, refreshInterval: 10000 }
  );

  return price;
};
export const useBNBBusdPrice = ():
  | Price<ERC20Token, ERC20Token>
  | undefined => {
  const chainId = useChainId();
  const isTestnet = chainId === 97;
  // Return bsc testnet wbnb if chain is testnet
  const wbnb: Token = isTestnet ? WBNB[ChainId.BSC_TESTNET] : WBNB[ChainId.BSC];
  return usePriceByPairs((BUSD as any)[wbnb.chainId], wbnb) as any;
};
export const useMKTPrice = (): any => {
  const chainId = useChainId();
  const isTestnet = chainId === 97;
  // Return bsc testnet cake if chain is testnet
  const wbnb: Token = isTestnet ? WBNB[ChainId.BSC_TESTNET] : WBNB[ChainId.BSC];
  const mktRatePerBNB = usePriceByPairs(wbnb, (MKT as any)[chainId]) as any;
  const { data: bnbPrice } = useSWR(["bnbPrice"], async () => {
    const data = await fetch(
      "https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDT"
    );
    const res = await data.json();
    return res.price;
  });
  const mktPrice = useMemo(() => {
    if (!mktRatePerBNB || !bnbPrice) {
      return "--";
    }
    const price = Number(mktRatePerBNB.toFixed(32)) * Number(bnbPrice ?? 0);
    return price.toFixed(12);
  }, [bnbPrice, mktRatePerBNB]);
  return mktPrice;
};

export const useMKTBNBPrice = () => {
  const chainId = useChainId();
  const isTestnet = chainId === 97;
  // Return bsc testnet cake if chain is testnet
  const wbnb: Token = isTestnet ? WBNB[ChainId.BSC_TESTNET] : WBNB[ChainId.BSC];
  const provider = useProvider({ chainId });
  const pairAddress = getLpAddress(wbnb as any, (MKT as any)[chainId] as any);
  const pairContract = usePairContract(pairAddress as any);

  const { data: totalWBNB } = useSWR(
    wbnb &&
      (MKT as any)[chainId] && [
        "pair-price",
        wbnb,
        (MKT as any)[chainId],
        pairAddress,
      ],
    async () => {
      const reserves = await pairContract?.connect(provider).getReserves();
      if (!reserves) {
        return null;
      }
      const { reserve0 } = reserves;
      return new BigNumber(reserve0._hex).dividedBy(1e18).toNumber();
    },
    { dedupingInterval: 10000, refreshInterval: 10000 }
  );
  const { data: totalSupply } = useSWR(
    ["get-total-supply", pairAddress],
    async () => {
      const data = await pairContract?.connect(provider).totalSupply();
      if (data) {
        return new BigNumber(data._hex).dividedBy(1e18).toNumber();
      }
    },
    { dedupingInterval: 10000, refreshInterval: 10000 }
  );
  const { data: bnbPrice } = useSWR(["bnbPrice"], async () => {
    const data = await fetch(
      "https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDT"
    );
    const res = await data.json();
    return res.price;
  });
  if (totalSupply && totalWBNB && bnbPrice) {
    return (totalWBNB * 2 * Number(bnbPrice)) / totalSupply;
  }
};
// @Note: only fetch from one pair
