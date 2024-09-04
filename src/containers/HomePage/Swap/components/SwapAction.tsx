import { Button } from "@chakra-ui/react";
import { Currency, Trade, TradeType } from "@pancakeswap/sdk";
import ButtonConnectWallet from "@src/components/ButtonConnectWallet";
import { Typography } from "@src/components/Typography";
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
} from "@src/constants/exchange";
import { ButtonComponent } from "@src/containers/PoolPage";
import { confirmPriceImpactWithoutFee } from "@src/hooks/confirmPriceImpactWithoutFee";
import { useSwapCallArguments } from "@src/hooks/swap/useSwapCallArguments";
import { useSwapCallback } from "@src/hooks/swap/useSwapCallback";
import { useToast } from "@src/hooks/useToast";
import { computeTradePriceBreakdown } from "@src/utils/exchange";
import React, { useCallback, useState } from "react";
import { useProvider } from "wagmi";

export const SwapAction = ({
  trade,
  titleButton,
  swapInputError,
  allowedSlippage,
  recipient,
  approveCallback,
  needApproval,
}: any) => {
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipient);
  const [isPending, setIsPending] = useState(false);
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    swapCalls
  );
  const [
    { tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });
  const provider = useProvider();
  const { toastError, toastSuccess } = useToast();

  const handleSwap = useCallback(() => {
    if (
      !!priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(
        priceImpactWithoutFee,
        PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
        ALLOWED_PRICE_IMPACT_HIGH
      )
    ) {
      return false;
    }
    if (!swapCallback) {
      return false;
    }
    // onOpenPendingConfirm();
    // onCloseSubmit();
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        // onClosePendingConfirm();
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });
        setIsPending(false);
      })
      .catch((error) => {
        // onClosePendingConfirm();
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
        setIsPending(false);
      });
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm]);
  const handleConfirm = useCallback(async () => {
    setIsPending(true);
    if (needApproval) {
      try {
        const res = await approveCallback();
        if (res) {
          setIsPending(false);
        }
      } catch (error) {
        setIsPending(false);
      }
      return true;
    }
    handleSwap();
  }, [approveCallback, handleSwap, needApproval]);
  return (
    <ButtonConnectWallet h="48px" w="100%">
      <ButtonComponent
        className={"prose cursor-pointer w-full bg-brand px-3 py-2"}
        h="48px"
        borderRadius={"8px"}
        textAlign="center"
        justifyContent={"center"}
        sx={{
          bg: "bg-brand",
        }}
        isDisabled={!!swapInputError || isPending}
        _hover={{}}
        _active={{}}
        onClick={handleConfirm}
        title={titleButton}
        loadingText={`${titleButton}...`}
        isLoading={isPending}
      />
    </ButtonConnectWallet>
  );
};
