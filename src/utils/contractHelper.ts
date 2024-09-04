import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { ChainId } from "@src/configs/web3/chains";
import { provider } from "@src/configs/web3/connectors";
// import { Contract } from "ethers";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getContract(
  address: string,
  ABI: any,
  chainId = ChainId.BSC,
  signer?: any
): Contract {
  if (!isAddress(address) || address === ZERO_ADDRESS) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  const signerOrProvider = signer ?? provider({ chainId });
  return new Contract(address, ABI, signerOrProvider);
}
