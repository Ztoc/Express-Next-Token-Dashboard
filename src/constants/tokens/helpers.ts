import type { TokenAddressMap } from "@pancakeswap/token-lists";
import { ChainId } from "@src/configs/web3/chains";

/**
 * An empty result, useful as a default.
 */
export const EMPTY_LIST: TokenAddressMap<ChainId> = {
  [ChainId.BSC]: {},
  [ChainId.BSC_TESTNET]: {},
};

export function serializeTokens(unserializedTokens: any) {
  const serializedTokens = Object.keys(unserializedTokens).reduce(
    (accum, key) => {
      return { ...accum, [key]: unserializedTokens[key].serialize };
    },
    {} as any
  );

  return serializedTokens;
}
