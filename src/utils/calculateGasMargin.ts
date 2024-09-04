import { BigNumber } from "@ethersproject/bignumber";

// add 10%
export function calculateGasMargin(value: BigNumber, margin = 1000): BigNumber {
 
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(margin)))
    .div(BigNumber.from(10000));
}
