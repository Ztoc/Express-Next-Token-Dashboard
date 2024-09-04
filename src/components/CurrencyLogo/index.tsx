import type { Token } from "@pancakeswap/sdk";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { getAddress } from "@src/utils/address.utils";
import { getTokenLogoURL, unknownTokenLogoURL } from "@src/utils/getCurrencyLogo";

interface ICurrencyLogo {
  currency?: Token;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const CurrencyLogo: React.FC<ICurrencyLogo> = ({
  className,
  currency,
  size = 24,
  style,
}) => {
  const { chainId } = useWeb3React();
  const src: string = useMemo(() => {
    const mkt = "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed"
    if (currency) {
      let address = currency?.address || "";
      if (typeof address !== "string") {
        // @ts-ignore
        address = getAddress(currency?.address, chainId);
      }
      if (
        currency?.symbol.toLowerCase() === "glr" ||
        currency?.name?.toLowerCase() === "glr" ||
        address?.toLowerCase() === mkt.toLowerCase()
      ) {
        return "/icons/single.svg";
      }
      if (
        currency?.symbol.toLowerCase() === "bnb" ||
        currency?.name?.toLowerCase() === "bnb" ||
        currency?.name?.toLowerCase() === "tbnb" ||
        currency?.symbol?.toLowerCase() === "tbnb"
      ) {
        return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png";
      }
      if (typeof currency.address !== "string") {
        return getTokenLogoURL(getAddress(currency?.address, chainId));
      }
      return getTokenLogoURL(currency?.address || "");
    }
    return unknownTokenLogoURL;
  }, [currency, chainId]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [currency]);

  return (
    <Image
      className={className}
      style={{ minWidth: `${size}px`, maxHeight: `${size}px`, ...style }}
      width={size}
      height={size}
      alt={`${currency?.symbol || ""}`}
      src={imageError ? unknownTokenLogoURL : src}
      onError={() => setImageError(true)}
    />
  );
};

export default CurrencyLogo;
