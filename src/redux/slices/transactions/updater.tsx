import { useToast as useToastChakra } from "@chakra-ui/react";
import { poll } from "@ethersproject/web";
import forEach from "lodash/forEach";
import merge from "lodash/merge";
import pickBy from "lodash/pickBy";
import React, { useEffect, useRef } from "react";
import { useProvider } from "wagmi";



import { finalizeTransaction } from "./actions";
import { useAllChainTransactions } from "./hooks";
import type { TransactionDetails } from "./reducer";
import { useToast } from "@src/hooks/useToast";
import { getBlockExploreLink } from "@src/utils/getExplorerLink";
import { useAppDispatch } from "@src/redux/store";

export function shouldCheck(
  fetchedTransactions: { [txHash: string]: TransactionDetails },
  tx: TransactionDetails
): boolean {
  if (tx.receipt) return false;
  return !fetchedTransactions[tx.hash];
}

export const Updater: React.FC<{ chainId: number }> = ({ chainId }) => {
  const provider = useProvider({ chainId });

  const dispatch = useAppDispatch();
  const transactions = useAllChainTransactions(chainId);
  const toastChakra = useToastChakra();

  const { toastError, toastSuccess } = useToast();

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>(
    {}
  );

  useEffect(() => {
    if (!chainId || !provider) return;

    forEach(
      pickBy(transactions, (transaction) =>
        shouldCheck(fetchedTransactions.current, transaction)
      ),
      (transaction) => {
        const getTransaction = async () => {
          await provider.getNetwork();

          const params = {
            transactionHash: provider.formatter.hash(transaction.hash, true),
          };

          poll(
            async () => {
              const result = await provider.perform(
                "getTransactionReceipt",
                params
              );

              if (result == null || result.blockHash == null) {
                return undefined;
              }

              const receipt = provider.formatter.receipt(result);

              dispatch(
                finalizeTransaction({
                  chainId,
                  hash: transaction.hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                })
              );
              const txId = getBlockExploreLink(
                receipt.transactionHash,
                "transaction",
                chainId
              );

              toastChakra.close(receipt.transactionHash);

              const toast = receipt.status === 1 ? toastSuccess : toastError;
              toast(
                "Transaction Successful!",
                <a
                  className={"m-0 text-sm text-primary-03"}
                  href={txId}
                  target={"_blank"}
                >
                  Transaction receipt
                </a>
              );

              if (
                (window as any).listTransactionsTrigger &&
                (window as any).listTransactionsTrigger[transaction.hash]
              ) {
                const triggerFunction =
                (window as any).listTransactionsTrigger[transaction.hash];
                triggerFunction && triggerFunction(receipt);
              }
              return true;
            },
            { onceBlock: provider }
          );
          merge(fetchedTransactions.current, {
            [transaction.hash]: transactions[transaction.hash],
          });
        };

        getTransaction();
      }
    );
  }, [
    chainId,
    toastChakra,
    toastError,
    toastSuccess,
    provider,
    transactions,
    dispatch,
  ]);

  return null;
};

export default Updater;
