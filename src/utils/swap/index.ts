import { BNB_ADDRESS } from "@src/constants";

export const getTokenAddress = (tokenAddress: undefined | string) => {
  if (!tokenAddress) {
    return "";
  }
  const lowerCaseAddress = tokenAddress.toLowerCase();
  if (lowerCaseAddress === "bnb") {
    return BNB_ADDRESS;
  }

  return lowerCaseAddress;
};
