import { useCallback } from "react";
import {
  ConnectorNotFoundError,
  useDisconnect,
  useConnect as useWeb3Connect,
} from "wagmi";

import { ConnectorNames } from "@src/configs/web3/wallets";
import { useChainIdLocal } from "./useWeb3React";

export const useConnectWallet = () => {
  const { connectAsync, connectors } = useWeb3Connect();
  const { disconnect } = useDisconnect();
  const [chainIdLocal] = useChainIdLocal();

  const login = useCallback(
    async (connectorId: ConnectorNames, chainId: number) => {
      const findConnector = connectors.find((c) => c.id === connectorId);
      try {
        await connectAsync({
          connector: findConnector,
          chainId: chainId || chainIdLocal,
        });
      } catch (error: any) {
        if (error instanceof ConnectorNotFoundError) {
          // todo: throw Wrong provider
        } else if (error) {
          // todo: throw User rejected request
        } else {
          // todo: throw message
          // toastError("Error", error?.message || "Something went wrong");
        }
        throw error;
      }
    },
    [connectAsync, connectors, chainIdLocal]
  );

  const logout = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error(error);
    } finally {
      // todo: clear data of user
    }
  }, [disconnect]);

  return { login, logout };
};
