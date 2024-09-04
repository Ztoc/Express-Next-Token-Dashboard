import { ethers } from "ethers";

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`;

export const unknownTokenLogoURL =
  "https://statics.gloryfinance.io/assets/images/unknownToken.svg";

export const getPancakeLogoUrl = (address: string) => {
  if (address.toLowerCase() === "0x1fc71fe3e333d5262828f3d348c12c7e52306b8a") {
    return "https://statics.gloryfinance.io/assets/images/glr.svg";
  }
  const convertAddress = convertToChecksumAddress(address);
  return `https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${convertAddress}/logo.png`;
};

export const convertToChecksumAddress = (address: string) => {
  const checksumAddress = ethers.utils.getAddress(address);
  return checksumAddress;
};
