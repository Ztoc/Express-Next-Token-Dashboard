import type { TransactionResponse } from "@ethersproject/providers";
import isEmpty from "lodash/isEmpty";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import omitBy from "lodash/omitBy";
import orderBy from "lodash/orderBy";
import pickBy from "lodash/pickBy";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";


import type { TransactionType } from "./actions";
import { addTransaction } from "./actions";
import type { TransactionDetails } from "./reducer";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { AppState, useAppDispatch } from "@src/redux/store";
import { useToast } from "@src/hooks/useToast";

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    summary?: string;
    translatableSummary?: {
      text: string;
      data?: Record<string, string | number>;
    };
    approval?: { tokenAddress: string; spender: string };
    claim?: { recipient: string };
    type?: TransactionType;
    trigger?: (data?: any) => void;
  }
) => void {
  const { chainId, account } = useWeb3React();
  const dispatch = useAppDispatch();
  const { toastProcessingTx } = useToast();

  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        translatableSummary,
        approval,
        claim,
        type,
        trigger,
      }: {
        summary?: string;
        translatableSummary?: {
          text: string;
          data?: Record<string, string | number>;
        };
        claim?: { recipient: string };
        approval?: { tokenAddress: string; spender: string };
        type?: TransactionType;
        trigger?: (data?: any) => void;
      } = {}
    ) => {
      if (!account) return;
      if (!chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error("No transaction hash found.");
      }
      toastProcessingTx(hash, 100000);
      // @ts-ignore
      window.listTransactionsTrigger[hash] = trigger;
      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          approval,
          summary,
          translatableSummary,
          claim,
          type,
        })
      );
    },
    [dispatch, chainId, account, toastProcessingTx]
  );
}

// returns all the transactions
export function useAllTransactions(): {
  [chainId: number]: { [txHash: string]: TransactionDetails };
} {
  const { address: account } = useAccount();

  const state: {
    [chainId: number]: {
      [txHash: string]: TransactionDetails;
    };
  } = useSelector<AppState, AppState["transactions"]>((s) => s.transactions);

  return useMemo(() => {
    return mapValues(state, (transactions) =>
      pickBy(
        transactions,
        (transactionDetails) =>
          transactionDetails.from.toLowerCase() === account?.toLowerCase()
      )
    );
  }, [account, state]);
}

export function useAllSortedRecentTransactions(): {
  [chainId: number]: { [txHash: string]: TransactionDetails };
} {
  const allTransactions = useAllTransactions();
  return useMemo(() => {
    return omitBy(
      mapValues(allTransactions, (transactions) =>
        keyBy(
          orderBy(
            pickBy(transactions, (trxDetails) =>
              isTransactionRecent(trxDetails)
            ),
            ["addedTime"],
            "desc"
          ),
          "hash"
        )
      ),
      isEmpty
    );
  }, [allTransactions]);
}

// returns all the transactions for the current chain
export function useAllActiveChainTransactions(): {
  [txHash: string]: TransactionDetails;
} {
  const { chainId } = useWeb3React();

  return useAllChainTransactions(chainId);
}

export function useAllChainTransactions(chainId: number): {
  [txHash: string]: TransactionDetails;
} {
  const { address: account } = useAccount();

  const state = useSelector<AppState, AppState["transactions"]>(
    (s) => s.transactions
  );

  return useMemo(() => {
    if (chainId && state[chainId]) {
      return pickBy(
        state[chainId],
        (transactionDetails) =>
          transactionDetails.from.toLowerCase() === account?.toLowerCase()
      );
    }
    return {};
  }, [account, chainId, state]);
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllActiveChainTransactions();

  if (!transactionHash || !transactions[transactionHash]) return false;

  return !transactions[transactionHash].receipt;
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return Date.now() - tx.addedTime < 86_400_000;
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(
  tokenAddress: string | undefined,
  spender: string | undefined
): boolean {
  const allTransactions = useAllActiveChainTransactions();
  return useMemo(
    () =>
      typeof tokenAddress === "string" &&
      typeof spender === "string" &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        }
        const { approval } = tx;
        if (!approval) return false;
        return (
          approval.spender === spender &&
          approval.tokenAddress === tokenAddress &&
          isTransactionRecent(tx)
        );
      }),
    [allTransactions, spender, tokenAddress]
  );
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

export function usePendingTransactions(): {
  hasPendingTransactions: boolean;
  pendingNumber: number;
} {
  const allTransactions = useAllTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions).flatMap((trxObjects) =>
      Object.values(trxObjects)
    );
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const hasPendingTransactions = !!pending.length;

  return {
    hasPendingTransactions,
    pendingNumber: pending.length,
  };
}
