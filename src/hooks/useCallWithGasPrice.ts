import type { CallOverrides, Contract } from "@ethersproject/contracts";
import type { TransactionResponse } from "@ethersproject/providers";
import get from "lodash/get";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import { AppState } from "@src/redux/store";
import { useGasPrice } from "@src/redux/slices/user/hooks";

export function useCallWithGasPrice() {
  const gasPrice = useGasPrice();
  const userGasPrice = useSelector<AppState, AppState["user"]["gasPrice"]>(
    (state) => state.user.gasPrice
  );

  /**
   * Perform a contract call with a gas price returned from useGasPrice
   * @param contract Used to perform the call
   * @param methodName The name of the method called
   * @param methodArgs An array of arguments to pass to the method
   * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
   * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
   */
  const callWithGasPrice = useCallback(
    async (
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      overrides: CallOverrides = null as any
    ): Promise<TransactionResponse> => {
      const contractMethod = get(contract, methodName);
      const hasManualGasPriceOverride = overrides?.gasPrice;
      return contractMethod(
        ...methodArgs,
        hasManualGasPriceOverride
          ? { ...overrides }
          : { ...overrides, gasPrice }
      );
    },
    [gasPrice, userGasPrice]
  );

  return { callWithGasPrice };
}
