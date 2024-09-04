import type { Icon } from "@chakra-ui/react";
import { isFirefox, isMobile } from "react-device-detect";

import { BinanceWallet } from "./icons/BinanceWallet";
import { BitKeep } from "./icons/BitKeep";
import { Coin98 } from "./icons/Coin98";
import { Coinbase } from "./icons/Coinbase";
import { MathWallet } from "./icons/MathWallet";
import { Metamask } from "./icons/Metamask";
import { SafePal } from "./icons/SafePal";
import { TokenPocket } from "./icons/TokenPocket";
import { TrustWallet } from "./icons/TrustWallet";
import { WalletConnect } from "./icons/WalletConnect";

export enum ConnectorNames {
  MetaMask = "metaMask",
  Injected = "injected",
  WalletConnect = "walletConnect",
  BSC = "bsc",
  WalletLink = "coinbaseWallet",
  TrustWalletInject = "trustWallet",
  BitKeepWallet = "bitkeepWallet",
}

export interface WalletsConfig {
  title: string;
  icon: typeof Icon;
  installed?: boolean;
  connectorId: ConnectorNames;
  priority: number;
  downloadLink?: {
    desktop?: string;
    mobile?: string;
  };
}

// @ts-ignore
export const ListWallets: WalletsConfig[] = [
  {
    title: "Metamask",
    icon: Metamask,
    installed:
      typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask),
    connectorId: ConnectorNames.MetaMask,
    downloadLink: {
      desktop: "https://metamask.app.link",
      mobile: "https://metamask.app.link",
    },
    priority: !isMobile ? 2 : 1,
  },
  {
    title: "Binance Wallet",
    icon: BinanceWallet,
    // @ts-ignore
    installed: typeof window !== "undefined" && Boolean(window.BinanceChain),
    connectorId: ConnectorNames.BSC,
    downloadLink: {
      desktop: isFirefox
        ? "https://addons.mozilla.org/en-US/firefox/addon/binance-chain/?src=search"
        : "https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp",
    },
    priority: 3,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    installed: true,
    connectorId: ConnectorNames.WalletConnect,
    priority: isMobile ? 1 : 2,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: ConnectorNames.TrustWalletInject,
    downloadLink: {
      desktop:
        "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph",
      mobile: "https://trustwallet.com/",
    },
    installed:
      typeof window !== "undefined" &&
      (Boolean(window.ethereum?.isTrust) ||
        // @ts-ignore
        Boolean(window.ethereum?.isTrustWallet)),
    priority:
      typeof window !== "undefined" &&
      (Boolean(window.ethereum?.isTrust) ||
        // @ts-ignore
        Boolean(window.ethereum?.isTrustWallet))
        ? 0
        : 4,
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    downloadLink: {
      mobile: "https://www.tokenpocket.pro/en/download/app",
      desktop: "https://www.tokenpocket.pro/en/download/app",
    },
    connectorId: ConnectorNames.Injected,
    priority:
      typeof window !== "undefined" && Boolean(window.ethereum?.isTokenPocket)
        ? 0
        : 999,
    installed:
      typeof window !== "undefined" && Boolean(window.ethereum?.isTokenPocket),
  },
  {
    title: "BitKeep",
    icon: BitKeep,
    downloadLink: {
      mobile: "https://bitkeep.io/",
      desktop: "https://bitkeep.io/",
    },
    connectorId: ConnectorNames.BitKeepWallet,
    priority:
      typeof window !== "undefined" && Boolean(window.ethereum?.isBitKeep)
        ? 0
        : 999,
    installed:
      typeof window !== "undefined" && Boolean(window.ethereum?.isBitKeep),
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    downloadLink: {
      mobile: "https://mathwallet.org/en-us/",
      desktop: "https://mathwallet.org/en-us/",
    },
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== "undefined" && Boolean(window.ethereum?.isMathWallet),
    priority:
      typeof window !== "undefined" && Boolean(window.ethereum?.isMathWallet)
        ? 0
        : 999,
  },
  {
    title: "Coin98",
    icon: Coin98,
    downloadLink: {
      mobile:
        "https://play.google.com/store/apps/details?id=coin98.crypto.finance.media&hl=en",
      desktop:
        "https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en",
    },
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== "undefined" &&
      // @ts-ignore
      (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98)),
    priority:
      typeof window !== "undefined" &&
      // @ts-ignore
      (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98))
        ? 0
        : 999,
  },
  {
    title: "SafePal",
    icon: SafePal,
    downloadLink: {
      mobile: "https://www.safepal.com/download",
      desktop: "https://www.safepal.com/download",
    },
    connectorId: ConnectorNames.Injected,
    installed:
      // @ts-ignore
      typeof window !== "undefined" && Boolean(window.ethereum?.isSafePal),
    priority:
      // @ts-ignore
      typeof window !== "undefined" && Boolean(window.ethereum?.isSafePal)
        ? 0
        : 999,
  },
  {
    title: "Coinbase Wallet",
    icon: Coinbase,
    downloadLink: {
      mobile: "https://www.coinbase.com/wallet/downloads",
      desktop: "https://www.coinbase.com/wallet/downloads",
    },
    connectorId: ConnectorNames.WalletLink,
    installed: true,
    priority: 5,
  },
];
