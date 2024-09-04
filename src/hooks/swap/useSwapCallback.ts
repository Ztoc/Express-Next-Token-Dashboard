import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import type { SwapParameters } from "@pancakeswap/sdk";
import { TradeType } from "@pancakeswap/sdk";
import { INITIAL_ALLOWED_SLIPPAGE } from "@src/constants";
import { V2TradeAndStableSwap } from "@src/constants/types";
import { useMemo } from "react";
import { useWeb3React } from "../useWeb3React";
import { useGasPrice } from "@src/redux/slices/user/hooks";
import { useTransactionAdder } from "@src/redux/slices/transactions/hooks";
import isZero from "@src/utils/isZero";
import { transactionErrorToUserReadableMessage } from "@src/utils/transactionErrorToUserReadableMessage";
import { calculateGasMargin } from "@src/utils/calculateGasMargin";
import { basisPointsToPercent } from "@src/utils/exchange";
import { isAddress } from "@src/utils/common";
import { getTruncateHash } from "@src/utils/getTruncateHash";
import { useToast } from "../useToast";

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract;
  parameters: SwapParameters;
}

interface SuccessfulCall extends SwapCallEstimate {
  gasEstimate: BigNumber;
}

interface FailedCall extends SwapCallEstimate {
  error: string;
}

interface SwapCallEstimate {
  call: SwapCall;
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: V2TradeAndStableSwap, // trade to execute, required
  allowedSlippage = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
  swapCalls: SwapCall[]
): {
  state: SwapCallbackState;
  callback: null | (() => Promise<string>);
  error: string | null;
} {
  const { account, chainId } = useWeb3React();
  const gasPrice = useGasPrice();
  const { toastError, toastSuccess } = useToast();

  // const addTransaction = useTransactionAdder();

  const recipient = recipientAddress === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !account || !chainId) {
      return {
        state: SwapCallbackState.INVALID,
        callback: null,
        error: "Missing dependencies",
      };
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return {
          state: SwapCallbackState.INVALID,
          callback: null,
          error: "Invalid recipient",
        };
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null };
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call;
            const options = !value || isZero(value) ? {} : { value };

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                };
              })
              .catch((gasError) => {
                console.error(
                  "Gas estimate failed, trying eth_call to extract error",
                  call
                );

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error(
                      "Unexpected successful call after failed estimate gas",
                      call,
                      gasError,
                      result
                    );
                    return {
                      call,
                      error:
                        "Unexpected issue with estimating the gas. Please try again.",
                    };
                  })
                  .catch((callError) => {
                    console.error("Call threw error", call, callError);

                    return {
                      call,
                      error: transactionErrorToUserReadableMessage(callError),
                    };
                  });
              });
          })
        );

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            "gasEstimate" in el &&
            (ix === list.length - 1 || "gasEstimate" in list[ix + 1])
        );

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter(
            (call): call is FailedCall => "error" in call
          );
          if (errorCalls.length > 0)
            throw new Error(errorCalls[errorCalls.length - 1].error);
          throw new Error(
            "Unexpected error. Could not estimate gas for the swap."
          );
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation;

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          gasPrice,
          ...(value && !isZero(value)
            ? { value, from: account }
            : { from: account }),
        })
          .then(async(response: any) => {
            const inputSymbol = trade.inputAmount.currency.symbol;
            const outputSymbol = trade.outputAmount.currency.symbol;
            const pct = basisPointsToPercent(allowedSlippage);
            const inputAmount =
              trade.tradeType === TradeType.EXACT_INPUT
                ? trade.inputAmount.toSignificant(3)
                : trade.maximumAmountIn(pct).toSignificant(3);

            const outputAmount =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? trade.outputAmount.toSignificant(3)
                : trade.minimumAmountOut(pct).toSignificant(3);

            const base = `Swap ${
              trade.tradeType === TradeType.EXACT_OUTPUT ? "max." : ""
            } ${inputAmount} ${inputSymbol} for ${
              trade.tradeType === TradeType.EXACT_INPUT ? "min." : ""
            } ${outputAmount} ${outputSymbol}`;

            const recipientAddressText =
              recipientAddress && isAddress(recipientAddress)
                ? getTruncateHash(recipientAddress)
                : recipientAddress;

            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${recipientAddressText}`;

            const translatableWithRecipient =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? recipient === account
                  ? "Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%"
                  : "Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%"
                : recipient === account
                ? "Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%"
                : "Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%";

            // addTransaction(response, {
            //   summary: withRecipient,
            //   translatableSummary: {
            //     text: translatableWithRecipient,
            //     data: {
            //       inputAmount,
            //       inputSymbol,
            //       outputAmount,
            //       outputSymbol,
            //       ...(recipient !== account && {
            //         recipientAddress: recipientAddressText,
            //       }) as any,
            //     },
            //   },
            //   type: "swap",
            // });
            const result = await response.wait(1);
            if(result){
              toastSuccess("Swap Successful", response.hash);

              return response.hash;

            }
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              toastError(
                "Error",
                "MetaMask Tx Signature: User denied transaction signature",
                4000
              );
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value);
              throw new Error(
                `Swap failed:${transactionErrorToUserReadableMessage(error)}`
              );
            }
          });
      },
      error: null,
    };
  }, [trade, account, chainId, recipient, recipientAddress, swapCalls, gasPrice, allowedSlippage, toastSuccess, toastError]);
}
