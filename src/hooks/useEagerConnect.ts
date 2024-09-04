import { useEffect } from "react";
import { useClient, useConnect } from "wagmi";
import { useWeb3React } from "./useWeb3React";


const SAFE_ID = "safe";

export const useEagerConnect = () => {
  const client = useClient();
  const { connectAsync, connectors } = useConnect();

  const { chainId } = useWeb3React();

  useEffect(() => {
    const connectorInstance = connectors.find(
      (c) => c.id === SAFE_ID && c.ready
    );

    if (typeof window !== "undefined" && window?.ethereum) {
      const cache = localStorage.getItem("wagmi.cache");
      if (cache) {
        if (
          connectorInstance &&
          // @ts-ignore
          !window.cy
        ) {
          connectAsync({ connector: connectorInstance }).catch(() => {
            client.autoConnect();
          });
        } else {
          client.autoConnect();
        }
      }
    }
  }, [client, connectAsync, connectors, chainId]);
};
