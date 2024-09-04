import { ethers } from "ethers";

import { ChainId } from "@src/configs/web3/chains";
import contracts from "@src/constants/contracts";
import type { Addresses } from "@src/constants/types";

export const getAddress = (
  address: Addresses,
  chainId = ChainId.BSC
): string => {
  return address?.[chainId] || ethers.constants.AddressZero;
};

export const getMasterChefAddress = (chainId = ChainId.BSC) => {
  return getAddress(contracts.masterChef, chainId);
};

export const getZapAddress = (chainId?: number) => {
  return getAddress(contracts.zap, chainId);
};

export const getGloryPoolAddress = (chainId?: number) => {
  return getAddress(contracts.gloryPool, chainId);
};
