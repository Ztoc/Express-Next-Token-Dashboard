import { Currency, CurrencyAmount, JSBI } from "@pancakeswap/sdk";
import { BIG_INT_ZERO, MIN_BNB } from "@src/constants/exchange";
import BigNumber from "bignumber.js";

export const maxAmountSpend = (token: Currency, amount: string) => {
  if (!token || !amount) return undefined;
  const isNative = token?.isNative;
  const minNative = 0.01;
  if (isNative) {
    if (new BigNumber(amount).isGreaterThan(new BigNumber(minNative))) {
      return new BigNumber(amount).minus(new BigNumber(minNative)).toFixed();
    }
    return "0";
  }
  return amount;
};


export function maxAmountSpend1(
  currencyAmount?: CurrencyAmount<Currency>
): CurrencyAmount<Currency> | undefined {
  if (!currencyAmount) return undefined;
  if (currencyAmount.currency?.isNative) {
    if (JSBI.greaterThan(currencyAmount.quotient, MIN_BNB)) {
      return CurrencyAmount.fromRawAmount(
        currencyAmount.currency,
        JSBI.subtract(currencyAmount.quotient, MIN_BNB)
      );
    }
    return CurrencyAmount.fromRawAmount(currencyAmount.currency, BIG_INT_ZERO);
  }
  return currencyAmount;
}