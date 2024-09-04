import { ERC20Token, Pair } from "@pancakeswap/sdk";

export function toV2LiquidityToken([tokenA, tokenB]: [
    ERC20Token,
    ERC20Token
  ]): ERC20Token {

   const token1AsTokenInstance = new ERC20Token(tokenA?.chainId, tokenA?.address, tokenA?.decimals, 'Cake-LP')
   const token2AsTokenInstance = new ERC20Token(tokenB?.chainId, tokenB?.address, tokenB?.decimals, 'Cake-LP')

    return new ERC20Token(
      tokenA.chainId,
      Pair.getAddress(token1AsTokenInstance as ERC20Token, token2AsTokenInstance as ERC20Token),
      18,
      "Cake-LP",
      "Pancake LPs"
    );
  }
  