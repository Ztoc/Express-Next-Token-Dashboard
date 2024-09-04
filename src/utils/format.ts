import BigNumber from "bignumber.js";
import numeral from "numeral";

/**
 * format a number to number with comma and decimals
 * @param val number want to format
 * @param suffix PRECISION number
 * @return formatted number
 */
export const formatNumberWithNumeral = (val: number | string, suffix?: number): string => {
    const stringDefault = "0000000000";
    try {
      const num = new BigNumber(val);
      if (val.toString()) {
        if (num.isLessThan(1)) {
          return num.toFixed(suffix || 3, BigNumber.ROUND_DOWN);
        } else if (num.isLessThan(1000)) {
          const newData = num.toFixed(Number(Number(suffix) < 4 ? suffix : 4), BigNumber.ROUND_DOWN);
          return numeral(newData).format(`0,0.${stringDefault.slice(0, suffix ?? 4)}`);
        } else if (num.isLessThan(1000000)) {
          const newData = num.toFixed(Number(Number(suffix) < 2 ? suffix : 2), BigNumber.ROUND_DOWN);
          return numeral(newData).format(`0,0.00`);
        } else {
          const newData = num.toFixed(Number(Number(suffix) < 2 ? suffix : 2), BigNumber.ROUND_DOWN);
          return numeral(newData).format(`0,0`);
        }
      } else {
        return "0.000";
      }
    } catch (e) {
      return "0.000";
    }
  };

  export const formatBigNumber  = (value: any, decimals= 18):number=> {
    if(!value) {
      return 0
    }
    return new BigNumber(value?._hex ?? 0).div(10 ** decimals).toNumber();
  }
  
  export const formatBnFromContractToString = (
    amount: any,
    decimals = 18,
    decimalsPlace = 8
  ) => {
    // eslint-disable-next-line no-underscore-dangle
    const data = BigNumber(amount?._hex || amount || 0);
  
    return data.div(10 ** decimals).toFixed(decimalsPlace);
  };
  