/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { hexValue } from "@ethersproject/bytes";
import type { Chain, RpcError } from "wagmi";
import {
  ConnectorNotFoundError,
  ResourceUnavailableError,
  SwitchChainNotSupportedError,
  UserRejectedRequestError,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const mappingNetwork: Record<number, string> = {
  56: "bsc-mainnet",
  97: "bsc-testnet",
};

const binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    Object.defineProperty(window, "BinanceChain", {
      get() {
        return this.bsc;
      },
      set(bsc) {
        this.bsc = bsc;

        resolve();
      },
    })
  );

export class BinanceWalletConnector extends InjectedConnector {
  override readonly id = "bsc";

  override readonly ready = typeof window !== "undefined";

  provider?: Window["BinanceChain"];

  constructor({
    chains: _chains,
  }: {
    chains?: Chain[];
  } = {}) {
    const options = {
      name: "Binance",
      shimDisconnect: false,
      shimChainChangedDisconnect: true,
    };
    const chains = _chains?.filter((c) => !!mappingNetwork[c.id]);
    super({
      chains,
      options,
    });
  }

  override async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      const account = await this.getAccount();
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      return { account, chain: { id, unsupported }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      if ((<RpcError>error).code === -32002)
        throw new ResourceUnavailableError(error);
      throw error;
    }
  }

  override async getProvider() {
    if (typeof window !== "undefined") {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/MetaMask/detect-provider#synchronous-and-asynchronous-injection=
      if (window.BinanceChain) {
        this.provider = window.BinanceChain;
      } else {
        await binanceChainListener();
        this.provider = window.BinanceChain;
      }
    }
    return this.provider;
  }

  override async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();

    const id = hexValue(chainId);

    if (mappingNetwork[chainId]) {
      try {
        await provider.switchNetwork?.(
          mappingNetwork[chainId] as unknown as string
        );

        return (
          this.chains.find((x) => x.id === chainId) ?? {
            id: chainId,
            name: `Chain ${id}`,
            network: `${id}`,
            rpcUrls: {
              default: {
                http: [""],
              },
              public: {
                http: [""],
              },
            },
            nativeCurrency: {
              name: "Binance native currency",
              symbol: "BNB",
              decimals: 18,
            },
          }
        );
      } catch (error) {
        if ((error as any).error === "user rejected") {
          throw new UserRejectedRequestError(error);
        }
      }
    }
    throw new SwitchChainNotSupportedError({ connector: this });
  }
}
