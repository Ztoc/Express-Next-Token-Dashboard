import type { ChainId } from "@pancakeswap/sdk";

let logged = false;

export const getFarmConfig = async (chainId: ChainId) => {
  try {
    return (await import(`/${chainId}.ts`)).default.filter(
      (f: { pid: null; }) => f.pid !== null
    );
  } catch (error) {
    if (!logged) {
      console.error("Cannot get farm config", error, chainId);
      logged = true;
    }
    return [];
  }
};
