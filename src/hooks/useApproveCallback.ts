import { MaxUint256 } from "@ethersproject/constants";
import type { TransactionResponse } from "@ethersproject/providers";
import type {
  Currency,
  CurrencyAmount,
  Trade,
  TradeType,
} from "@pancakeswap/sdk";
import { useCallback, useMemo } from "react";
import { useAccount, useProvider } from "wagmi";

import {
  ROUTER_ADDRESS,
  computeSlippageAdjustedAmounts,
} from "../utils/exchange";
import { useCallWithGasPrice } from "./useCallWithGasPrice";
import { useToast } from "./useToast";
import useTokenAllowance from "./useTokenAllowance";
import { useTokenContract } from "./useCommonContract";
import {
  useHasPendingApproval,
  useTransactionAdder,
} from "@src/redux/slices/transactions/hooks";
import { calculateGasMargin } from "@src/utils/calculateGasMargin";
import { Field } from "@src/containers/HomePage/Swap";

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { address: account } = useAccount();
  const { callWithGasPrice } = useCallWithGasPrice();
  const provider = useProvider();
  const { toastError, toastSuccess } = useToast();

  const token = amountToApprove?.currency?.isToken
    ? amountToApprove.currency
    : undefined;
  const currentAllowance = useTokenAllowance(
    token,
    account ?? undefined,
    spender
  );
  const pendingApproval = useHasPendingApproval(token?.address, spender);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;
    // amountToApprove will be defined if currentAllowance is
    // eslint-disable-next-line no-nested-ternary
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, pendingApproval, spender]);
  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<any> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      toastError("Error", "Approve was called unnecessarily");
      console.error("approve was called unnecessarily");
      return undefined;
    }
    if (!token) {
      toastError("Error", "No token");
      console.error("no token");
      return undefined;
    }

    if (!tokenContract) {
      toastError(
        "Error",
        `Cannot find contract of the token ${token?.address}`
      );
      console.error("tokenContract is null");
      return undefined;
    }

    if (!amountToApprove) {
      toastError("Error", "Missing amount to approve");
      console.error("missing amount to approve");
      return undefined;
    }

    if (!spender) {
      toastError("Error", "No spender");
      console.error("no spender");
      return undefined;
    }

    let useExact = false;

    const estimatedGas = await tokenContract.estimateGas
      .approve(spender, MaxUint256)
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true;
        return tokenContract.estimateGas
          .approve(spender, amountToApprove.quotient.toString())
          .catch(() => {
            console.error("estimate gas failure");
            toastError(
              "Error",
              "Unexpected error. Could not estimate gas for the approve."
            );
            return null;
          });
      });

    if (!estimatedGas) return undefined;

    return callWithGasPrice(
      tokenContract,
      "approve",
      [spender, useExact ? amountToApprove.quotient.toString() : MaxUint256],
      {
        gasLimit: calculateGasMargin(estimatedGas),
      }
    )
      .then(async (response: TransactionResponse) => {
        const result = await response.wait(1);
        // addTransaction(response, {
        //   summary: `Approve ${amountToApprove.currency.symbol}`,
        //   translatableSummary: {
        //     text: `Approve ${amountToApprove.currency.symbol}`,
        //   },
        //   approval: { tokenAddress: token.address, spender },
        //   type: "approve",
        // });
        if (result) {
          toastSuccess("Approve Successfully", response.hash);
        }
        return result;
      })
      .catch((error: any) => {
        console.error("Failed to approve token", error);
        if (error?.code !== 4001) {
          toastError(
            "Error",
            "MetaMask Tx Signature: User denied transaction signature",
            4000
          );
        }
        // return false;
        throw error;
      });
  }, [approvalState, token, tokenContract, amountToApprove, spender, callWithGasPrice, toastError, toastSuccess]);

  return [approvalState, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  trade?: Trade<Currency, Currency, TradeType>,
  allowedSlippage = 0,
  chainId?: number
) {
  const amountToApprove = useMemo(
    () =>
      trade
        ? (computeSlippageAdjustedAmounts(trade, allowedSlippage) as any)[
            Field.INPUT
          ]
        : undefined,
    [trade, allowedSlippage]
  );
  return useApproveCallback(amountToApprove, ROUTER_ADDRESS[chainId ?? 56]);
}
