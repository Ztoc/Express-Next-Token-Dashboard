import type { ChainId, Currency, ERC20Token, Token } from "@pancakeswap/sdk";
import { CurrencyAmount, Native, WNATIVE } from "@pancakeswap/sdk";

export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: ChainId | undefined = 56
) {
  return chainId && currency?.isNative
    ? WNATIVE[chainId] as ERC20Token
    : currency?.isToken
    ? currency as Token
    : undefined;
}
export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined
): CurrencyAmount<Token> | undefined {
  const token =
    currencyAmount && chainId
      ? wrappedCurrency(currencyAmount.currency, chainId)
      : undefined;
  return token && currencyAmount
    ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient)
    : undefined;
}

export function unwrappedToken(token: Token): Currency {
  if (token.isNative) return Native.onChain(token.chainId);
  return token;
}
