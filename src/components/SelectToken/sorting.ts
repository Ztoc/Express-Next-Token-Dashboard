import { getTokenComparator, type Token } from "@pancakeswap/sdk";
import { useAllTokenBalances } from "@src/hooks/wallet";
import { useMemo } from "react";


function useTokenComparator(
  inverted: boolean
): (tokenA: Token, tokenB: Token) => number {
  const balances = useAllTokenBalances();
  const comparator = useMemo(
    () => getTokenComparator(balances ?? {}),
    [balances]
  );
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1;
    }
    return comparator;
  }, [inverted, comparator]);
}

export default useTokenComparator;
