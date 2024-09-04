import { explorerConfig } from "@src/configs/explorerConfig";
import { useWeb3React } from "./useWeb3React";

export enum SubExplorerPath {
  TX = "tx",
  ADDRESS = "address",
}

export const useGetExplorer = (
  sub: SubExplorerPath,
  txHashOrAddress: string
) => {
  const { chainId } = useWeb3React();
  const explorerLink = explorerConfig[chainId];
  return `${explorerLink}${sub}/${txHashOrAddress}`;
};
