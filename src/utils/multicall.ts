import type { CallOverrides } from "@ethersproject/contracts";
import type { Call } from "@pancakeswap/multicall";
import { createMulticall } from "@pancakeswap/multicall";
import { provider } from "@src/configs/web3/connectors";


export type { Call };

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean;
}


const {
  multicall,
  multicallv2,
  multicallv3,
  // multicallv2Typed,
  // multicallv3Typed,
} = createMulticall(provider);

export default multicall;

// multicallv3, multicallv3Typed
export { multicallv2, multicallv3 };
