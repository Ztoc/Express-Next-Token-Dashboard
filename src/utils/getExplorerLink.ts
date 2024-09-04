import { ChainId, bsc } from "@src/configs/web3/chains";
import { chains } from "@src/configs/web3/connectors";

export function getBlockExploreLink(
  data: string | number,
  type: "transaction" | "token" | "address" | "block" | "countdown",
  chainIdOverride?: number
): string {
  const chainId = chainIdOverride || ChainId.BSC;
  const chain: any = chains.find((c) => c.id === chainId);
  if (!chain) return (bsc as any)?.blockExplorers.default.url;
  switch (type) {
    case "transaction": {
      return `${chain.blockExplorers.default.url}/tx/${data}`;
    }
    case "token": {
      return `${chain.blockExplorers.default.url}/token/${data}`;
    }
    case "block": {
      return `${chain.blockExplorers.default.url}/block/${data}`;
    }
    case "countdown": {
      return `${chain.blockExplorers.default.url}/block/countdown/${data}`;
    }
    default: {
      return `${chain.blockExplorers.default.url}/address/${data}`;
    }
  }
}
